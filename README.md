# dedocx

[![CircleCI](https://circleci.com/gh/science-periodicals/dedocx.svg?style=svg)](https://circleci.com/gh/science-periodicals/dedocx)

[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

Swiss Army Chainsaw for DOCX to HTML conversion.

This library converts from MS Word docx files to HTML in the dumbest way
possible. That is to say that it does almost nothing beyond producing a lot of
`div`s, `span`s, and `p`s. Apart from a very limited set of very obvious
elements (and even then) it does not try to interpret the docx content as HTML.

While this may seem counterintuitive, the value in this approach is that the
programming model with which one transforms to better, richer HTML is simply by
manipulating the HTML DOM. If a feature is not supported, you don't need to
learn a new API: you just need to write some JS to modify an HTML DOM. You can
use whichever way of doing that you like, be it the raw DOM, jQuery, or whatever
else you might enjoy. By applying several small modules that enhance the pretty
brutal HTML that comes out of this module, you can get really rich and useful
HTML in a very flexible manner.

One thing that this module _does_ do for you is that it tries to expose _all_
the information that a docx contains. This means not just the main document, but
also the footnotes and endnotes, all the media, all the relationships for all
parts, the bibliography, and hooks for custom content that it does not know how
to handle.

## API

The core API for dedocx is just a single function that takes some options and
returns either an error or a context object with all the requisite information:

```js
import dedocx from 'dedocx';
dedocx({ sourcePath: 'some-doc.docx' }, (err, ctx) => {
  // process error or result from the context
});
```

### dedocx Options

- `sourcePath`: The path to the document to be processed. Required.
- `tmpPath`: The path to a temporary directory to use when unzipping things. Defaults to a generated
  directory.
- `log`: An object that accepts logging for `log()`, `warn()`, and `error()`. Defaults to the
  `console`.
- `styleMap`: A map that can be used to manage the behaviour of certain named styles so as to have
  them create a specific element (eg. a `w:p` with a named style of `Heading1` will produce an `h1`
  instead of the default `p`). It is probably better not to play with this unless you know what
  you are doing. The default is implemented by `lib/default-style-map`. Keys in the map are style
  names. Values are either objects (with `el` giving the output element name and optionally an
  `attr` map providing the attributes) or functions accepting a source element `src` and an `out`
  element which is the current position in the output tree. The function is expected to return an
  object with an `output` key being the element that gets appended to the current one, and `walk`
  which is the element that will be the new context. These are different so that you may map a
  single named style to a subtree of several elements, attach the top element to the current output
  but have the next step start inside a specific sub-element in the tree.
- `plugins`: An array of plugins. These are essentially just functions that will be called with the
  context and a callback. They are expected to just modify the context in place and call back when
  done.

### Context

The primary context outputs are:

- `doc`: The output HTML.
- `bibliography`: The bibliography object containing the references.
- `docProps`: The metadata for the whole document.

The context will also contain the following, but in general you only need to call them if you are
processing things at a pretty low level (likely internal to dedocx, not even in a plugin).

- `fileTree`: All the files, keyed by package-relative name, with `{ fullPath, mediaType, rels }`
  information.
- `resolveFileType`: A function that knows how to resolve file types.
- `defaultRunProps`: The default style props for text runs.
- `defaultParaProps`: The default style props for paragraphs.
- `styles`: An array of named styles.
- `docx`: The main document in the DOCX package.
- `mainDocumentRels`: The relations for the main document.
- `numbering`: The numbering information as it applies to lists.

## Architecture

The architecture is essentially a big pipeline, with some sub-pipelines for
things that need to be called more than once.

The processing is standard for OOXML packaging (though parts that we don't need
are not done). The zip is opened, the media type and relations files are read
(each content file has relations that influence how its content works), then the
content/data/style files are processed in turn in order to produce some HTML and
a couple objects that put together have all the information.

The primary pipeline is this (all files are under `pipeline/*`):

1.  `pick-tmp`: pick a temporary directory if none was set.
2.  `unzip`: unzips everything to the `tmpPath`.
3.  `content-types`: loads the media types specification from the file and generates the
    `resolveFileType()` function that can resolve files' types.
4.  `file-tree`: maps out the full file tree with resolved paths and media types.
5.  `rels`: loads all the relations documents in the file tree, extracts the information from them,
    and attaches that information to the correct files in the file tree.
6.  `doc-props`: loads all the metadata files described as relations and extracts the information
    from them to put in the `docProps` object. These are the metadata that one can see in the document
    properties in Word.
7.  `styles`: loads the styling document (based on rels) so as to have default style information.
    Currently this is only done for the main document; in practice it should be supported for some
    specific document types in multi-document Word files (eg. glossary).
8.  `theme`: loads the theming information (mostly colours) from the relevant relation. Currently
    done relatively superficially.
9.  `numbering`: loads the number relation so as to know which lists map to what list types. It is
    currently relatively superficial.
10. `settings`: loads the settings relation; currently this is a no-op. Some values might be useful
    notably around hyphenation.
11. `load-main-document`: loads the main document, prepares it for querying with the internal fast
    XPath system (which supports caching), and runs the `predigest` pipeline on it.
12. `load-bibliography`: loads the bibliographic information by running the bibliography pipeline.
13. `load-footnotes`: loads the footnotes and endnotes documents, calls `predigest` on them, and
    attaches them to the context.
14. `walk-document`: a `marcheur` style sheet that does the actual DOCX to HTML conversion. The
    principle is very simple: each `match()` matches a given element (or list of elements, or similar
    simple query) and calls its function if it matches. The function gets the source element, the
    current output, and a walker object. It can manipulate the output tree any way it wants to, and
    when done should either do nothing (marcheur will continue walking wherever it is) or call
    `walk()` with the element that should be the new output context.

The `predigest` pipeline is as follows:

1.  `fields`: Word has a very complex dynamic fields system built on`fldChar`/`instrText`/`fldSimple`
    and including the fact that partial dynamic commands can be split out so as to have their own
    style, can nest, etc. This converts all dynamic fields to a simpler and easier to process syntax
    in the `SA_NS` namespace.
1.  `bookmarkIds`: Word reuses unique identifiers when documents are made of multiple parts; this
    makes them all really unique.
1.  `textboxBookmarks`: Same as the previous one but for text boxes (that are included in duplicate
    ways).
1.  `loadDrawingData`: Loads all the drawing data, and pre-processes it so that it can be used for
    multifigures.
1.  `embedRelationships`: Relations are used as indirections for images and links; this embeds the
    actual value so that downstream processors don't need to look things up in the relations (which
    becomes impossible when documents that Word considers to be logically separate become merged into
    the same HTML tree).
1.  `lists`: Lists in Word are just paragraphs styled as list items that happen to be next to one
    another, with specific properties overriding their depth and style. This turns them into
    properly nested structures.
1.  `captions`: Captions in Word have no structure, this has heuristics to guess what a given caption
    is captioning and modifies the tree to make captions more usable downstream.
1.  `reparentBookmarks`: Bookmarks in Word have no tree-like structure, but rather are ranges — even
    when they are clearly meant to apply to a given element. This makes things a lot clearer.
1.  `applyBookmarks`: Attaches some bookmarks directly as IDs to specific elements when it is clear
    that that is what was meant.

## Plugins

All plugins have the same structure. They export a function that can be called with optional
configuration. That function returns another function, which is a simple transformation step that
expects a context and a callback.

## Error Handling

In general, `dedocx` will keep ploughing ahead in the face of an error. The idea is to try to
salvage as much content as possible. The idea is that if you `throw` an error in a pipeline step
(typically in a plugin if you're writing extension code), then it will get logged but the next
step in line will get executed all the same.

The manner in which a real, problematic, halt-and-catch-fire error is signalled is through the
conventional first callback argument. This should be reserved to cases that cannot be recovered
from however, eg. the DOCX cannot be read.

## DOCX

A Microsoft Word DOCX file is a zip file containing a number of different parts when unzipped. To view the parts, change the extension from `.docx` to `.zip` and unzip the file. Relevant parts include:

- `[Content_Types].xml`: List of all content types of the parts in the package (e.g., the main document). _Every part and its type must be listed_.
- `_rels/`: Folder of relationship part files. There are several relationship part files, e.g., for the entire package `_rels/.rels`, for the main document `word/_rels/document.xml.rels`, etc. Each relationship file contains links to other parts, e.g. the main document, styles, themes, footer, or external links (e.g., `<Relationship Id="rId1"Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument"Target="word/document.xml"/>`).
- `word/`: The main document, with separate files for endnotes, footnotes, numbering, settings, styles, and fonts, a folder of media files contained in the document, and relationships
- `customXml/`: The markup for the bibliography (`item1.xml`), properties of the bibliography (`itemProps1.xml`), and the associated relationships (`_rels/item1.xml.rels`)

For more information, see: http://www.datypic.com/sc/ooxml/ss.html

## Example output

Below is an example of a document containing the minimum feature set extracted by dedocx (for the full document see [minimum-test-document.docx](/test/fixtures/minimim-test-document.docx)).

![image](/test/fixtures/minimum-test-document.png)

For the HTML resulting from the docx see: [minimum-test-document.js](/test/fixtures/minimum-test-document.js).
