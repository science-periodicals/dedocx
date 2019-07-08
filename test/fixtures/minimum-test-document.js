import React from 'react'; 
 const jsx = (
  <body>
    <h1 data-dedocx-props={{ elementType: 'para', pStyle: 'Heading1' }}>
      Document title
    </h1>
    <header
      className="dedocx-subtitle"
      data-dedocx-props={{ elementType: 'para', pStyle: 'Subtitle' }}
    >
      <p>Document subtitle</p>
    </header>
    <h2
      data-dedocx-props={{ elementType: 'para', pStyle: 'Heading2' }}
      id="_Ref521321793"
    >
      Heading 2
    </h2>
    <h3 data-dedocx-props={{ elementType: 'para', pStyle: 'Heading3' }}>
      Heading 3
    </h3>
    <h4 data-dedocx-props={{ elementType: 'para', pStyle: 'Heading4' }}>
      Heading 4
    </h4>
    <h5 data-dedocx-props={{ elementType: 'para', pStyle: 'Heading5' }}>
      Heading 5
    </h5>
    <h6 data-dedocx-props={{ elementType: 'para', pStyle: 'Heading6' }}>
      Heading 6
    </h6>
    <blockquote data-dedocx-props={{ elementType: 'para', pStyle: 'Quote' }}>
      <p>“A block quote.” </p>
    </blockquote>
    <blockquote data-dedocx-props={{ elementType: 'para', pStyle: 'Quote' }}>
      <p>- John Smith</p>
    </blockquote>
    <p id="_Ref521321585">
      Paragraph with a{' '}
      <a
        data-w_history="1"
        data-sans_rel={{
          id: 'rId8',
          type:
            'http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink',
          target: 'https://sci.pe/',
          targetMode: 'external',
          fullPath:
            '/var/folders/pr/7r562dtd7q5dnkg_wx6tfwsm0000gn/T/tmp-2515O3MLLHgLj3nV/word/https:/sci.pe',
          packagePath: '/word/https:/sci.pe'
        }}
        href="https://sci.pe/"
      >
        <span data-dedocx-props={{ elementType: 'run', rStyle: 'Hyperlink' }}>
          hyperlink
        </span>
      </a>
      .
    </p>
    <p>
      Footnote
      <sup
        data-dedocx-props={{ elementType: 'run', rStyle: 'FootnoteReference' }}
      >
        <a role="doc-noteref" href="#dedocx-footnote-1">
          1
        </a>
      </sup>
    </p>
    <p>
      Endnote
      <sup
        data-dedocx-props={{ elementType: 'run', rStyle: 'EndnoteReference' }}
      >
        <a role="doc-noteref" href="#dedocx-endnote-1">
          1
        </a>
      </sup>{' '}
    </p>
    <p id="bk1">Bookmark</p>
    <p>
      A cross-reference to a{' '}
      <a href="#bk1" role="doc-anchorlink">
        Bookmark
      </a>
      .
    </p>
    <p>
      A cross-reference to a footnote
      <sup
        data-dedocx-props={{ elementType: 'run', rStyle: 'FootnoteReference' }}
      >
        <a role="doc-noteref" href="#dedocx-footnote-1">
          1
        </a>
      </sup>
      .
    </p>
    <p>
      A second cross-reference to a footnote
      <sup
        data-dedocx-props={{ elementType: 'run', rStyle: 'FootnoteReference' }}
      >
        <a role="doc-noteref" href="#dedocx-footnote-1">
          1
        </a>
      </sup>
      .
    </p>
    <p>
      A cross-reference to a label (
      <a href="#_Ref521321604" role="doc-anchorlink">
        Figure{' '}
        <span data-dedocx-props={{ elementType: 'run', noProof: true }}>1</span>
      </a>
      ).
    </p>
    <p>
      A cross-reference to a heading:{' '}
      <a href="#_Ref521321793" role="doc-anchorlink">
        Heading 2
      </a>
      .
    </p>
    <p />
    <p>
      Full citation{' '}
      <span
        data-dedocx-props={{
          elementType: 'para',
          citation: true,
          id: '1417902355'
        }}
      />
      <a href="#Kil11" role="doc-biblioref" data-dedocx-citation-options={{}}>
        <span data-dedocx-props={{ elementType: 'run', noProof: true }}>
          (Kilpatrick, 2011)
        </span>
      </a>
      .{' '}
    </p>
    <p>
      Citation with author and title suppressed{' '}
      <span
        data-dedocx-props={{
          elementType: 'para',
          citation: true,
          id: '716177556'
        }}
      />
      <a
        href="#Kil11"
        role="doc-biblioref"
        data-dedocx-citation-options={{
          suppressAuthors: true,
          suppressTitle: true
        }}
      >
        <span data-dedocx-props={{ elementType: 'run', noProof: true }}>
          (2011)
        </span>
      </a>
      .{' '}
    </p>
    <p>
      Point citation{' '}
      <span
        data-dedocx-props={{
          elementType: 'para',
          citation: true,
          id: '1854689021'
        }}
      />
      <a
        href="#Kil11"
        role="doc-biblioref"
        data-dedocx-citation-options={{ page: 325 }}
      >
        <span data-dedocx-props={{ elementType: 'run', noProof: true }}>
          (Kilpatrick, 2011, p. 325)
        </span>
      </a>
      .{' '}
    </p>
    <p />
    <p>
      <span className="commentRangeStart" id="commentRangeStart_TlaML-5Td_4" />
      Commented text
      <span className="commentRangeEnd" id="commentRangeEnd_TlaML-5Td_4" />
      <span
        data-dedocx-props={{ elementType: 'run', rStyle: 'CommentReference' }}
      >
        <span className="commentReference" id="commentReference_TlaML-5Td_4" />
      </span>{' '}
      <span data-dedocx-props={{ elementType: 'run', highlight: 'yellow' }}>
        Highlights
      </span>
      , <em>Italics</em>, <strong>Bold</strong>, <u>Underlined</u>,{' '}
      <s>Striket</s>
      <s>hr</s>
      <s>ough</s>
    </p>
    <p />
    <p>An unordered list:</p>
    <ul>
      <li
        data-dedocx-props={{
          elementType: 'para',
          pStyle: 'ListParagraph',
          numPr: { ilvl: 0, numId: 6 }
        }}
        id="_GoBack"
      >
        Item 1 unordered
      </li>
      <li
        data-dedocx-props={{
          elementType: 'para',
          pStyle: 'ListParagraph',
          numPr: { ilvl: 0, numId: 6 }
        }}
      >
        Item 2 unordered
      </li>
    </ul>
    <p />
    <p>A ordered list:</p>
    <ol>
      <li
        data-dedocx-props={{
          elementType: 'para',
          pStyle: 'ListParagraph',
          numPr: { ilvl: 0, numId: 7 }
        }}
      >
        First ordered
      </li>
      <li
        data-dedocx-props={{
          elementType: 'para',
          pStyle: 'ListParagraph',
          numPr: { ilvl: 0, numId: 7 }
        }}
      >
        Second ordered
      </li>
    </ol>
    <p />
    <p>An unordered, nested list:</p>
    <ul>
      <li
        data-dedocx-props={{
          elementType: 'para',
          pStyle: 'ListParagraph',
          numPr: { ilvl: 0, numId: 1 }
        }}
      >
        Item 1 unordered, nested
        <ul>
          <li
            data-dedocx-props={{
              elementType: 'para',
              pStyle: 'ListParagraph',
              numPr: { ilvl: 1, numId: 1 }
            }}
          >
            Item 2 unordered, nested
          </li>
        </ul>
      </li>
    </ul>
    <p />
    <p>An ordered, nested list:</p>
    <ol>
      <li
        data-dedocx-props={{
          elementType: 'para',
          pStyle: 'ListParagraph',
          numPr: { ilvl: 0, numId: 2 }
        }}
      >
        First ordered, nested
        <ol>
          <li
            data-dedocx-props={{
              elementType: 'para',
              pStyle: 'ListParagraph',
              numPr: { ilvl: 1, numId: 2 }
            }}
          >
            Second ordered, nested
          </li>
        </ol>
      </li>
    </ol>
    <p />
    <p>A mixed, nested list:</p>
    <ol>
      <li
        data-dedocx-props={{
          elementType: 'para',
          pStyle: 'ListParagraph',
          numPr: { ilvl: 0, numId: 4 }
        }}
      >
        First
        <ul>
          <li
            data-dedocx-props={{
              elementType: 'para',
              pStyle: 'ListParagraph',
              numPr: { ilvl: 1, numId: 4 }
            }}
          >
            Blue
            <ol>
              <li
                data-dedocx-props={{
                  elementType: 'para',
                  pStyle: 'ListParagraph',
                  numPr: { ilvl: 2, numId: 4 }
                }}
              >
                A
              </li>
              <li
                data-dedocx-props={{
                  elementType: 'para',
                  pStyle: 'ListParagraph',
                  numPr: { ilvl: 2, numId: 4 }
                }}
              >
                B
              </li>
            </ol>
          </li>
        </ul>
      </li>
    </ol>
    <p />
    <p />
    <p>
      <span data-dedocx-props={{ elementType: 'run', noProof: true }}>
        <span className="w_drawing">
          <span
            data-distt="0"
            data-distb="0"
            data-distl="0"
            data-distr="0"
            data-wp14_anchorid="379A1762"
            data-wp14_editid="2B23C14E"
            className="wp_inline"
          >
            <span data-cx="1549400" data-cy="1549400" className="wp_extent" />
            <span
              data-l="0"
              data-t="0"
              data-r="0"
              data-b="0"
              className="wp_effectExtent"
            />
            <span data-id="1" data-name="Picture 1" className="wp_docPr" />
            <span className="wp_cNvGraphicFramePr">
              <span
                data-xmlns_a="http://schemas.openxmlformats.org/drawingml/2006/main"
                data-nochangeaspect="1"
                className="a_graphicFrameLocks"
              />
            </span>
            <span
              data-xmlns_a="http://schemas.openxmlformats.org/drawingml/2006/main"
              className="a_graphic"
            >
              <span
                data-uri="http://schemas.openxmlformats.org/drawingml/2006/picture"
                className="a_graphicData"
              >
                <span
                  data-xmlns_pic="http://schemas.openxmlformats.org/drawingml/2006/picture"
                  className="pic_pic"
                >
                  <span className="pic_nvPicPr">
                    <span
                      data-id="1"
                      data-name="Screen Shot 2018-08-06 at 11.51.10 AM.png"
                      className="pic_cNvPr"
                    />
                    <span className="pic_cNvPicPr" />
                  </span>
                  <span className="pic_blipFill">
                    <img
                      src="/var/folders/pr/7r562dtd7q5dnkg_wx6tfwsm0000gn/T/tmp-2515O3MLLHgLj3nV/word/media/image1.png"
                      data-dedocx-rel-target="media/image1.png"
                      data-dedocx-rel-package-path="/word/media/image1.png"
                    />
                    <span className="a_stretch">
                      <span className="a_fillRect" />
                    </span>
                  </span>
                  <span className="pic_spPr">
                    <span className="a_xfrm">
                      <span data-x="0" data-y="0" className="a_off" />
                      <span
                        data-cx="1549400"
                        data-cy="1549400"
                        className="a_ext"
                      />
                    </span>
                    <span data-prst="rect" className="a_prstGeom">
                      <span className="a_avLst" />
                    </span>
                  </span>
                </span>
              </span>
            </span>
          </span>
        </span>
      </span>
    </p>
    <p />
    <p
      data-dedocx-props={{
        elementType: 'para',
        rPr: {
          rFonts: {
            ascii: 'Times New Roman',
            hAnsi: 'Times New Roman',
            eastAsia: 'Times New Roman',
            cs: 'Times New Roman'
          }
        }
      }}
    >
      <span data-dedocx-props={{ elementType: 'run', noProof: true }}>
        <span data-w14_anchorid="22123E52" className="w_pict">
          <span
            data-id="_x0000_t75"
            data-coordsize="21600,21600"
            data-o_spt="75"
            data-o_preferrelative="t"
            data-path="m@4@5l@4@11@9@11@9@5xe"
            data-filled="f"
            data-stroked="f"
            className="v_shapetype"
          >
            <span data-joinstyle="miter" className="v_stroke" />
            <span className="v_formulas">
              <span data-eqn="if lineDrawn pixelLineWidth 0" className="v_f" />
              <span data-eqn="sum @0 1 0" className="v_f" />
              <span data-eqn="sum 0 0 @1" className="v_f" />
              <span data-eqn="prod @2 1 2" className="v_f" />
              <span data-eqn="prod @3 21600 pixelWidth" className="v_f" />
              <span data-eqn="prod @3 21600 pixelHeight" className="v_f" />
              <span data-eqn="sum @0 0 1" className="v_f" />
              <span data-eqn="prod @6 1 2" className="v_f" />
              <span data-eqn="prod @7 21600 pixelWidth" className="v_f" />
              <span data-eqn="sum @8 21600 0" className="v_f" />
              <span data-eqn="prod @7 21600 pixelHeight" className="v_f" />
              <span data-eqn="sum @10 21600 0" className="v_f" />
            </span>
            <span
              data-o_extrusionok="f"
              data-gradientshapeok="t"
              data-o_connecttype="rect"
              className="v_path"
            />
            <span data-v_ext="edit" data-aspectratio="t" className="o_lock" />
          </span>
          <span
            data-id="Picture 9"
            data-o_spid="_x0000_s1026"
            data-type="#_x0000_t75"
            data-alt="Image result for ventura"
            data-style="position:absolute;margin-left:0;margin-top:-.4pt;width:161.3pt;height:107.55pt;z-index:251661312;visibility:visible;mso-wrap-edited:f;mso-width-percent:0;mso-height-percent:0;mso-width-percent:0;mso-height-percent:0"
            className="v_shape"
          >
            <img
              src="/var/folders/pr/7r562dtd7q5dnkg_wx6tfwsm0000gn/T/tmp-2515O3MLLHgLj3nV/word/media/image2.jpeg"
              data-dedocx-rel-target="media/image2.jpeg"
              data-dedocx-rel-package-path="/word/media/image2.jpeg"
            />
            <span data-type="topAndBottom" className="w10_wrap" />
          </span>
        </span>
      </span>
    </p>
    <p
      data-dedocx-props={{ elementType: 'para', keepNext: true }}
      data-dedocx-caption-group="dPv3csztT3"
      data-dedocx-caption-target-type="image"
    >
      <span data-dedocx-props={{ elementType: 'run', noProof: true }}>
        <span className="w_drawing">
          <span
            data-distt="0"
            data-distb="0"
            data-distl="0"
            data-distr="0"
            data-wp14_anchorid="4159F479"
            data-wp14_editid="7AED32C9"
            className="wp_inline"
          >
            <span data-cx="1566817" data-cy="1562100" className="wp_extent" />
            <span
              data-l="0"
              data-t="0"
              data-r="0"
              data-b="0"
              className="wp_effectExtent"
            />
            <span
              data-id="2"
              data-name="Picture 2"
              data-descr="/Users/tiffany/Desktop/Screen Shot 2017-12-14 at 10.28.28 PM.png"
              className="wp_docPr"
            />
            <span className="wp_cNvGraphicFramePr">
              <span
                data-xmlns_a="http://schemas.openxmlformats.org/drawingml/2006/main"
                data-nochangeaspect="1"
                className="a_graphicFrameLocks"
              />
            </span>
            <span
              data-xmlns_a="http://schemas.openxmlformats.org/drawingml/2006/main"
              className="a_graphic"
            >
              <span
                data-uri="http://schemas.openxmlformats.org/drawingml/2006/picture"
                className="a_graphicData"
              >
                <span
                  data-xmlns_pic="http://schemas.openxmlformats.org/drawingml/2006/picture"
                  className="pic_pic"
                >
                  <span className="pic_nvPicPr">
                    <span
                      data-id="0"
                      data-name="Picture 2"
                      data-descr="/Users/tiffany/Desktop/Screen Shot 2017-12-14 at 10.28.28 PM.png"
                      className="pic_cNvPr"
                    />
                    <span className="pic_cNvPicPr">
                      <span
                        data-nochangeaspect="1"
                        data-nochangearrowheads="1"
                        className="a_picLocks"
                      />
                    </span>
                  </span>
                  <span className="pic_blipFill">
                    <img
                      src="/var/folders/pr/7r562dtd7q5dnkg_wx6tfwsm0000gn/T/tmp-2515O3MLLHgLj3nV/word/media/image3.png"
                      data-dedocx-rel-target="media/image3.png"
                      data-dedocx-rel-package-path="/word/media/image3.png"
                    />
                    <span className="a_srcRect" />
                    <span className="a_stretch">
                      <span className="a_fillRect" />
                    </span>
                  </span>
                  <span data-bwmode="auto" className="pic_spPr">
                    <span className="a_xfrm">
                      <span data-x="0" data-y="0" className="a_off" />
                      <span
                        data-cx="1588020"
                        data-cy="1583239"
                        className="a_ext"
                      />
                    </span>
                    <span data-prst="rect" className="a_prstGeom">
                      <span className="a_avLst" />
                    </span>
                    <span className="a_noFill" />
                    <span className="a_ln">
                      <span className="a_noFill" />
                    </span>
                  </span>
                </span>
              </span>
            </span>
          </span>
        </span>
      </span>
    </p>
    <div className="dedocx-caption" data-dedocx-caption-group="dPv3csztT3">
      <p
        data-dedocx-props={{ elementType: 'para', pStyle: 'Caption' }}
        id="_Ref521321604"
      >
        <span className="dedocx-label">
          Figure{' '}
          <span data-w_instr=" SEQ Figure \* ARABIC " className="w_fldSimple">
            <span data-dedocx-props={{ elementType: 'run', noProof: true }}>
              1
            </span>
          </span>
        </span>{' '}
        A captioned image.
      </p>
    </div>
    <div
      className="dedocx-picture-grid"
      data-dedocx-caption-group="fxdVNUJyD6"
      data-dedocx-caption-target-type="multi-image"
    >
      <div className="dedocx-picture-grid-item">
        <img
          src="/var/folders/pr/7r562dtd7q5dnkg_wx6tfwsm0000gn/T/tmp-2515O3MLLHgLj3nV/word/media/image4.jpg"
          data-dedocx-rel-target="media/image4.jpg"
          data-dedocx-rel-package-path="/word/media/image4.jpg"
          style="width: 4.14cm; "
        />
        <span className="dedocx-picture-grid-label">A</span>
      </div>
      <div className="dedocx-picture-grid-item">
        <img
          src="/var/folders/pr/7r562dtd7q5dnkg_wx6tfwsm0000gn/T/tmp-2515O3MLLHgLj3nV/word/media/image5.jpg"
          data-dedocx-rel-target="media/image5.jpg"
          data-dedocx-rel-package-path="/word/media/image5.jpg"
          style="width: 4.14cm; "
        />
        <span className="dedocx-picture-grid-label">B</span>
      </div>
    </div>
    <div className="dedocx-caption" data-dedocx-caption-group="fxdVNUJyD6">
      <p data-dedocx-props={{ elementType: 'para', pStyle: 'Caption' }}>
        <span className="dedocx-label">
          Figure{' '}
          <span data-w_instr=" SEQ Figure \* ARABIC " className="w_fldSimple">
            <span data-dedocx-props={{ elementType: 'run', noProof: true }}>
              2
            </span>
          </span>
        </span>{' '}
        A multipart figure with caption.
      </p>
    </div>
    <p />
    <div className="dedocx-caption" data-dedocx-caption-group="Zfu3QH7x7X">
      <p
        data-dedocx-props={{
          elementType: 'para',
          keepNext: true,
          pStyle: 'Caption'
        }}
      >
        <span className="dedocx-label">
          Table{' '}
          <span data-w_instr=" SEQ Table \* ARABIC " className="w_fldSimple">
            <span data-dedocx-props={{ elementType: 'run', noProof: true }}>
              1
            </span>
          </span>
        </span>{' '}
        A table with images and footnotes.
      </p>
    </div>
    <table
      data-dedocx-props={{
        elementType: 'table',
        tblStyle: 'GridTable5Dark-Accent3',
        tblW: { w: 0, type: 'auto' },
        tblLook: {
          val: '07E0',
          firstRow: true,
          lastRow: true,
          firstColumn: true,
          lastColumn: true,
          noHBand: true,
          noVBand: true
        }
      }}
      data-dedocx-caption-group="Zfu3QH7x7X"
      data-dedocx-caption-target-type="table"
    >
      <thead>
        <tr
          data-dedocx-props={{
            elementType: 'tr',
            cnfStyle: {
              val: '100000000000',
              firstRow: true,
              lastRow: false,
              firstColumn: false,
              lastColumn: false,
              oddVBand: false,
              evenVBand: false,
              oddHBand: false,
              evenHBand: false,
              firstRowFirstColumn: false,
              firstRowLastColumn: false,
              lastRowFirstColumn: false,
              lastRowLastColumn: false
            }
          }}
        >
          <th
            data-dedocx-props={{
              elementType: 'tc',
              tcW: { w: 2056, type: 'dxa' },
              cnfStyle: {
                val: '001000000000',
                firstRow: false,
                lastRow: false,
                firstColumn: true,
                lastColumn: false,
                oddVBand: false,
                evenVBand: false,
                oddHBand: false,
                evenHBand: false,
                firstRowFirstColumn: false,
                firstRowLastColumn: false,
                lastRowFirstColumn: false,
                lastRowLastColumn: false
              }
            }}
          >
            <p />
          </th>
          <th
            data-dedocx-props={{
              elementType: 'tc',
              tcW: { w: 2596, type: 'dxa' }
            }}
          >
            <p
              data-dedocx-props={{
                elementType: 'para',
                cnfStyle: {
                  val: '100000000000',
                  firstRow: true,
                  lastRow: false,
                  firstColumn: false,
                  lastColumn: false,
                  oddVBand: false,
                  evenVBand: false,
                  oddHBand: false,
                  evenHBand: false,
                  firstRowFirstColumn: false,
                  firstRowLastColumn: false,
                  lastRowFirstColumn: false,
                  lastRowLastColumn: false
                }
              }}
            >
              Header 2
            </p>
          </th>
          <th
            data-dedocx-props={{
              elementType: 'tc',
              tcW: { w: 2409, type: 'dxa' }
            }}
          >
            <p
              data-dedocx-props={{
                elementType: 'para',
                cnfStyle: {
                  val: '100000000000',
                  firstRow: true,
                  lastRow: false,
                  firstColumn: false,
                  lastColumn: false,
                  oddVBand: false,
                  evenVBand: false,
                  oddHBand: false,
                  evenHBand: false,
                  firstRowFirstColumn: false,
                  firstRowLastColumn: false,
                  lastRowFirstColumn: false,
                  lastRowLastColumn: false
                }
              }}
            >
              Header 3
            </p>
          </th>
          <th
            data-dedocx-props={{
              elementType: 'tc',
              tcW: { w: 2289, type: 'dxa' },
              cnfStyle: {
                val: '000100000000',
                firstRow: false,
                lastRow: false,
                firstColumn: false,
                lastColumn: true,
                oddVBand: false,
                evenVBand: false,
                oddHBand: false,
                evenHBand: false,
                firstRowFirstColumn: false,
                firstRowLastColumn: false,
                lastRowFirstColumn: false,
                lastRowLastColumn: false
              }
            }}
          >
            <p>Total</p>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th
            data-dedocx-props={{
              elementType: 'tc',
              tcW: { w: 2056, type: 'dxa' },
              cnfStyle: {
                val: '001000000000',
                firstRow: false,
                lastRow: false,
                firstColumn: true,
                lastColumn: false,
                oddVBand: false,
                evenVBand: false,
                oddHBand: false,
                evenHBand: false,
                firstRowFirstColumn: false,
                firstRowLastColumn: false,
                lastRowFirstColumn: false,
                lastRowLastColumn: false
              }
            }}
          >
            <p>A</p>
          </th>
          <td
            data-dedocx-props={{
              elementType: 'tc',
              tcW: { w: 2596, type: 'dxa' }
            }}
          >
            <p
              data-dedocx-props={{
                elementType: 'para',
                cnfStyle: {
                  val: '000000000000',
                  firstRow: false,
                  lastRow: false,
                  firstColumn: false,
                  lastColumn: false,
                  oddVBand: false,
                  evenVBand: false,
                  oddHBand: false,
                  evenHBand: false,
                  firstRowFirstColumn: false,
                  firstRowLastColumn: false,
                  lastRowFirstColumn: false,
                  lastRowLastColumn: false
                }
              }}
            >
              Inline image{' '}
              <span
                data-w_instr=" INCLUDEPICTURE 'https://www.researchgate.net/profile/Minja_Gerber/publication/264636991/figure/fig2/AS:392410174640138@1470569284765/Chemical-structure-of-curcumin.png' \* MERGEFORMATINET "
                className="w_fldSimple"
              >
                <span data-dedocx-props={{ elementType: 'run', noProof: true }}>
                  <span className="w_drawing">
                    <span
                      data-distt="0"
                      data-distb="0"
                      data-distl="0"
                      data-distr="0"
                      data-wp14_anchorid="5B138064"
                      data-wp14_editid="16316EE5"
                      className="wp_inline"
                    >
                      <span
                        data-cx="1509823"
                        data-cy="563280"
                        className="wp_extent"
                      />
                      <span
                        data-l="0"
                        data-t="0"
                        data-r="1905"
                        data-b="0"
                        className="wp_effectExtent"
                      />
                      <span
                        data-id="7"
                        data-name="Picture 7"
                        data-descr="Related image"
                        className="wp_docPr"
                      />
                      <span className="wp_cNvGraphicFramePr">
                        <span
                          data-xmlns_a="http://schemas.openxmlformats.org/drawingml/2006/main"
                          data-nochangeaspect="1"
                          className="a_graphicFrameLocks"
                        />
                      </span>
                      <span
                        data-xmlns_a="http://schemas.openxmlformats.org/drawingml/2006/main"
                        className="a_graphic"
                      >
                        <span
                          data-uri="http://schemas.openxmlformats.org/drawingml/2006/picture"
                          className="a_graphicData"
                        >
                          <span
                            data-xmlns_pic="http://schemas.openxmlformats.org/drawingml/2006/picture"
                            className="pic_pic"
                          >
                            <span className="pic_nvPicPr">
                              <span
                                data-id="0"
                                data-name="Picture 1"
                                data-descr="Related image"
                                className="pic_cNvPr"
                              />
                              <span className="pic_cNvPicPr">
                                <span
                                  data-nochangeaspect="1"
                                  data-nochangearrowheads="1"
                                  className="a_picLocks"
                                />
                              </span>
                            </span>
                            <span className="pic_blipFill">
                              <img
                                src="/var/folders/pr/7r562dtd7q5dnkg_wx6tfwsm0000gn/T/tmp-2515O3MLLHgLj3nV/word/media/image6.png"
                                data-dedocx-rel-target="media/image6.png"
                                data-dedocx-rel-package-path="/word/media/image6.png"
                              />
                              <span className="a_srcRect" />
                              <span className="a_stretch">
                                <span className="a_fillRect" />
                              </span>
                            </span>
                            <span data-bwmode="auto" className="pic_spPr">
                              <span className="a_xfrm">
                                <span data-x="0" data-y="0" className="a_off" />
                                <span
                                  data-cx="1533852"
                                  data-cy="572245"
                                  className="a_ext"
                                />
                              </span>
                              <span data-prst="rect" className="a_prstGeom">
                                <span className="a_avLst" />
                              </span>
                              <span className="a_noFill" />
                              <span className="a_ln">
                                <span className="a_noFill" />
                              </span>
                            </span>
                          </span>
                        </span>
                      </span>
                    </span>
                  </span>
                </span>
              </span>
            </p>
          </td>
          <td
            data-dedocx-props={{
              elementType: 'tc',
              tcW: { w: 2409, type: 'dxa' }
            }}
          >
            <p
              data-dedocx-props={{
                elementType: 'para',
                cnfStyle: {
                  val: '000000000000',
                  firstRow: false,
                  lastRow: false,
                  firstColumn: false,
                  lastColumn: false,
                  oddVBand: false,
                  evenVBand: false,
                  oddHBand: false,
                  evenHBand: false,
                  firstRowFirstColumn: false,
                  firstRowLastColumn: false,
                  lastRowFirstColumn: false,
                  lastRowLastColumn: false
                }
              }}
            >
              <span data-dedocx-props={{ elementType: 'run', noProof: true }}>
                <span className="w_drawing">
                  <span
                    data-distt="0"
                    data-distb="0"
                    data-distl="114300"
                    data-distr="114300"
                    data-simplepos="0"
                    data-relativeheight="251659264"
                    data-behinddoc="0"
                    data-locked="0"
                    data-layoutincell="1"
                    data-allowoverlap="1"
                    data-wp14_anchorid="30EECD10"
                    data-wp14_editid="31561F3D"
                    className="wp_anchor"
                  >
                    <span data-x="0" data-y="0" className="wp_simplePos" />
                    <span data-relativefrom="column" className="wp_positionH">
                      <span className="wp_posOffset">-64770</span>
                    </span>
                    <span
                      data-relativefrom="paragraph"
                      className="wp_positionV"
                    >
                      <span className="wp_posOffset">72168</span>
                    </span>
                    <span
                      data-cx="1392865"
                      data-cy="765175"
                      className="wp_extent"
                    />
                    <span
                      data-l="0"
                      data-t="0"
                      data-r="0"
                      data-b="0"
                      className="wp_effectExtent"
                    />
                    <span className="wp_wrapTopAndBottom" />
                    <span
                      data-id="5"
                      data-name="Picture 9"
                      data-descr="Image result for chemical structure"
                      className="wp_docPr"
                    />
                    <span className="wp_cNvGraphicFramePr">
                      <span
                        data-xmlns_a="http://schemas.openxmlformats.org/drawingml/2006/main"
                        className="a_graphicFrameLocks"
                      />
                    </span>
                    <span
                      data-xmlns_a="http://schemas.openxmlformats.org/drawingml/2006/main"
                      className="a_graphic"
                    >
                      <span
                        data-uri="http://schemas.openxmlformats.org/drawingml/2006/picture"
                        className="a_graphicData"
                      >
                        <span
                          data-xmlns_pic="http://schemas.openxmlformats.org/drawingml/2006/picture"
                          className="pic_pic"
                        >
                          <span className="pic_nvPicPr">
                            <span
                              data-id="0"
                              data-name="Picture 9"
                              data-descr="Image result for chemical structure"
                              className="pic_cNvPr"
                            />
                            <span className="pic_cNvPicPr">
                              <span className="a_picLocks" />
                            </span>
                          </span>
                          <span className="pic_blipFill">
                            <img
                              src="/var/folders/pr/7r562dtd7q5dnkg_wx6tfwsm0000gn/T/tmp-2515O3MLLHgLj3nV/word/media/image7.png"
                              data-dedocx-rel-target="media/image7.png"
                              data-dedocx-rel-package-path="/word/media/image7.png"
                            />
                            <span className="a_srcRect" />
                            <span className="a_stretch">
                              <span className="a_fillRect" />
                            </span>
                          </span>
                          <span data-bwmode="auto" className="pic_spPr">
                            <span className="a_xfrm">
                              <span data-x="0" data-y="0" className="a_off" />
                              <span
                                data-cx="1392865"
                                data-cy="765175"
                                className="a_ext"
                              />
                            </span>
                            <span data-prst="rect" className="a_prstGeom">
                              <span className="a_avLst" />
                            </span>
                            <span className="a_noFill" />
                          </span>
                        </span>
                      </span>
                    </span>
                    <span data-relativefrom="page" className="wp14_sizeRelH">
                      <span className="wp14_pctWidth">0</span>
                    </span>
                    <span data-relativefrom="page" className="wp14_sizeRelV">
                      <span className="wp14_pctHeight">0</span>
                    </span>
                  </span>
                </span>
              </span>
            </p>
          </td>
          <td
            data-dedocx-props={{
              elementType: 'tc',
              tcW: { w: 2289, type: 'dxa' },
              cnfStyle: {
                val: '000100000000',
                firstRow: false,
                lastRow: false,
                firstColumn: false,
                lastColumn: true,
                oddVBand: false,
                evenVBand: false,
                oddHBand: false,
                evenHBand: false,
                firstRowFirstColumn: false,
                firstRowLastColumn: false,
                lastRowFirstColumn: false,
                lastRowLastColumn: false
              }
            }}
          >
            <p>Total A</p>
          </td>
        </tr>
        <tr>
          <th
            data-dedocx-props={{
              elementType: 'tc',
              tcW: { w: 2056, type: 'dxa' },
              cnfStyle: {
                val: '001000000000',
                firstRow: false,
                lastRow: false,
                firstColumn: true,
                lastColumn: false,
                oddVBand: false,
                evenVBand: false,
                oddHBand: false,
                evenHBand: false,
                firstRowFirstColumn: false,
                firstRowLastColumn: false,
                lastRowFirstColumn: false,
                lastRowLastColumn: false
              }
            }}
          >
            <p>B</p>
          </th>
          <td
            data-dedocx-props={{
              elementType: 'tc',
              tcW: { w: 2596, type: 'dxa' }
            }}
          >
            <p
              data-dedocx-props={{
                elementType: 'para',
                cnfStyle: {
                  val: '000000000000',
                  firstRow: false,
                  lastRow: false,
                  firstColumn: false,
                  lastColumn: false,
                  oddVBand: false,
                  evenVBand: false,
                  oddHBand: false,
                  evenHBand: false,
                  firstRowFirstColumn: false,
                  firstRowLastColumn: false,
                  lastRowFirstColumn: false,
                  lastRowLastColumn: false
                }
              }}
            >
              <math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
                <msup>
                  <mrow>
                    <mi>a</mi>
                  </mrow>
                  <mrow>
                    <mn>2</mn>
                  </mrow>
                </msup>
                <mo>+</mo>
                <msup>
                  <mrow>
                    <mi>b</mi>
                  </mrow>
                  <mrow>
                    <mn>2</mn>
                  </mrow>
                </msup>
                <mo>=</mo>
                <msup>
                  <mrow>
                    <mi>c</mi>
                  </mrow>
                  <mrow>
                    <mn>2</mn>
                  </mrow>
                </msup>
              </math>
            </p>
          </td>
          <td
            data-dedocx-props={{
              elementType: 'tc',
              tcW: { w: 2409, type: 'dxa' }
            }}
          >
            <p
              data-dedocx-props={{
                elementType: 'para',
                cnfStyle: {
                  val: '000000000000',
                  firstRow: false,
                  lastRow: false,
                  firstColumn: false,
                  lastColumn: false,
                  oddVBand: false,
                  evenVBand: false,
                  oddHBand: false,
                  evenHBand: false,
                  firstRowFirstColumn: false,
                  firstRowLastColumn: false,
                  lastRowFirstColumn: false,
                  lastRowLastColumn: false
                }
              }}
            >
              Data
              <sup
                data-dedocx-props={{
                  elementType: 'run',
                  rStyle: 'FootnoteReference'
                }}
              >
                <a role="doc-noteref" href="#dedocx-footnote-2">
                  2
                </a>
              </sup>{' '}
            </p>
          </td>
          <td
            data-dedocx-props={{
              elementType: 'tc',
              tcW: { w: 2289, type: 'dxa' },
              cnfStyle: {
                val: '000100000000',
                firstRow: false,
                lastRow: false,
                firstColumn: false,
                lastColumn: true,
                oddVBand: false,
                evenVBand: false,
                oddHBand: false,
                evenHBand: false,
                firstRowFirstColumn: false,
                firstRowLastColumn: false,
                lastRowFirstColumn: false,
                lastRowLastColumn: false
              }
            }}
          >
            <p
              data-dedocx-props={{
                elementType: 'para',
                tabs: [{ val: 'center' }]
              }}
            >
              Total B{' '}
            </p>
          </td>
        </tr>
        <tr>
          <th
            data-dedocx-props={{
              elementType: 'tc',
              tcW: { w: 2056, type: 'dxa' },
              cnfStyle: {
                val: '001000000000',
                firstRow: false,
                lastRow: false,
                firstColumn: true,
                lastColumn: false,
                oddVBand: false,
                evenVBand: false,
                oddHBand: false,
                evenHBand: false,
                firstRowFirstColumn: false,
                firstRowLastColumn: false,
                lastRowFirstColumn: false,
                lastRowLastColumn: false
              }
            }}
          >
            <p>C</p>
          </th>
          <td
            data-dedocx-props={{
              elementType: 'tc',
              tcW: { w: 2596, type: 'dxa' }
            }}
          >
            <p
              data-dedocx-props={{
                elementType: 'para',
                cnfStyle: {
                  val: '000000000000',
                  firstRow: false,
                  lastRow: false,
                  firstColumn: false,
                  lastColumn: false,
                  oddVBand: false,
                  evenVBand: false,
                  oddHBand: false,
                  evenHBand: false,
                  firstRowFirstColumn: false,
                  firstRowLastColumn: false,
                  lastRowFirstColumn: false,
                  lastRowLastColumn: false
                }
              }}
            >
              Data
            </p>
          </td>
          <td
            data-dedocx-props={{
              elementType: 'tc',
              tcW: { w: 2409, type: 'dxa' }
            }}
          >
            <p
              data-dedocx-props={{
                elementType: 'para',
                cnfStyle: {
                  val: '000000000000',
                  firstRow: false,
                  lastRow: false,
                  firstColumn: false,
                  lastColumn: false,
                  oddVBand: false,
                  evenVBand: false,
                  oddHBand: false,
                  evenHBand: false,
                  firstRowFirstColumn: false,
                  firstRowLastColumn: false,
                  lastRowFirstColumn: false,
                  lastRowLastColumn: false
                }
              }}
            >
              Data
              <math xmlns="http://www.w3.org/1998/Math/MathML" display="inline">
                <mi> </mi>
                <mi>A</mi>
                <mo>=</mo>
                <mi>π</mi>
                <msup>
                  <mrow>
                    <mi>r</mi>
                  </mrow>
                  <mrow>
                    <mn>2</mn>
                  </mrow>
                </msup>
              </math>
            </p>
          </td>
          <td
            data-dedocx-props={{
              elementType: 'tc',
              tcW: { w: 2289, type: 'dxa' },
              cnfStyle: {
                val: '000100000000',
                firstRow: false,
                lastRow: false,
                firstColumn: false,
                lastColumn: true,
                oddVBand: false,
                evenVBand: false,
                oddHBand: false,
                evenHBand: false,
                firstRowFirstColumn: false,
                firstRowLastColumn: false,
                lastRowFirstColumn: false,
                lastRowLastColumn: false
              }
            }}
          >
            <p>Total C</p>
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr
          data-dedocx-props={{
            elementType: 'tr',
            cnfStyle: {
              val: '010000000000',
              firstRow: false,
              lastRow: true,
              firstColumn: false,
              lastColumn: false,
              oddVBand: false,
              evenVBand: false,
              oddHBand: false,
              evenHBand: false,
              firstRowFirstColumn: false,
              firstRowLastColumn: false,
              lastRowFirstColumn: false,
              lastRowLastColumn: false
            }
          }}
        >
          <th
            data-dedocx-tfoot="true"
            data-dedocx-props={{
              elementType: 'tc',
              tcW: { w: 2056, type: 'dxa' },
              cnfStyle: {
                val: '001000000000',
                firstRow: false,
                lastRow: false,
                firstColumn: true,
                lastColumn: false,
                oddVBand: false,
                evenVBand: false,
                oddHBand: false,
                evenHBand: false,
                firstRowFirstColumn: false,
                firstRowLastColumn: false,
                lastRowFirstColumn: false,
                lastRowLastColumn: false
              }
            }}
          >
            <p
              data-dedocx-props={{
                elementType: 'para',
                tabs: [{ val: 'center' }]
              }}
            >
              Total Row
            </p>
          </th>
          <td
            data-dedocx-tfoot="true"
            data-dedocx-props={{
              elementType: 'tc',
              tcW: { w: 2596, type: 'dxa' }
            }}
          >
            <p
              data-dedocx-props={{
                elementType: 'para',
                cnfStyle: {
                  val: '010000000000',
                  firstRow: false,
                  lastRow: true,
                  firstColumn: false,
                  lastColumn: false,
                  oddVBand: false,
                  evenVBand: false,
                  oddHBand: false,
                  evenHBand: false,
                  firstRowFirstColumn: false,
                  firstRowLastColumn: false,
                  lastRowFirstColumn: false,
                  lastRowLastColumn: false
                }
              }}
            >
              Total 2
            </p>
          </td>
          <td
            data-dedocx-tfoot="true"
            data-dedocx-props={{
              elementType: 'tc',
              tcW: { w: 2409, type: 'dxa' }
            }}
          >
            <p
              data-dedocx-props={{
                elementType: 'para',
                cnfStyle: {
                  val: '010000000000',
                  firstRow: false,
                  lastRow: true,
                  firstColumn: false,
                  lastColumn: false,
                  oddVBand: false,
                  evenVBand: false,
                  oddHBand: false,
                  evenHBand: false,
                  firstRowFirstColumn: false,
                  firstRowLastColumn: false,
                  lastRowFirstColumn: false,
                  lastRowLastColumn: false
                }
              }}
            >
              Total 3
            </p>
          </td>
          <td
            data-dedocx-tfoot="true"
            data-dedocx-props={{
              elementType: 'tc',
              tcW: { w: 2289, type: 'dxa' },
              cnfStyle: {
                val: '000100000000',
                firstRow: false,
                lastRow: false,
                firstColumn: false,
                lastColumn: true,
                oddVBand: false,
                evenVBand: false,
                oddHBand: false,
                evenHBand: false,
                firstRowFirstColumn: false,
                firstRowLastColumn: false,
                lastRowFirstColumn: false,
                lastRowLastColumn: false
              }
            }}
          >
            <p>Total</p>
          </td>
        </tr>
      </tfoot>
    </table>
    <p />
    <p>
      <span data-dedocx-props={{ elementType: 'run', noProof: true }}>
        <span className="mc_AlternateContent">
          <span data-requires="wps" className="mc_Choice">
            <span className="w_drawing">
              <span
                data-distt="0"
                data-distb="0"
                data-distl="0"
                data-distr="0"
                data-wp14_anchorid="509ED463"
                data-wp14_editid="0887F631"
                className="wp_inline"
              >
                <span
                  data-cx="3191933"
                  data-cy="935665"
                  className="wp_extent"
                />
                <span
                  data-l="0"
                  data-t="0"
                  data-r="8890"
                  data-b="17145"
                  className="wp_effectExtent"
                />
                <span data-id="4" data-name="Text Box 4" className="wp_docPr" />
                <span className="wp_cNvGraphicFramePr" />
                <span
                  data-xmlns_a="http://schemas.openxmlformats.org/drawingml/2006/main"
                  className="a_graphic"
                >
                  <span
                    data-uri="http://schemas.microsoft.com/office/word/2010/wordprocessingShape"
                    className="a_graphicData"
                  >
                    <span className="wps_wsp">
                      <span data-txbox="1" className="wps_cNvSpPr" />
                      <span className="wps_spPr">
                        <span className="a_xfrm">
                          <span data-x="0" data-y="0" className="a_off" />
                          <span
                            data-cx="3191933"
                            data-cy="935665"
                            className="a_ext"
                          />
                        </span>
                        <span data-prst="rect" className="a_prstGeom">
                          <span className="a_avLst" />
                        </span>
                        <span className="a_solidFill">
                          <span data-val="lt1" className="a_schemeClr" />
                        </span>
                        <span data-w="6350" className="a_ln">
                          <span className="a_solidFill">
                            <span data-val="black" className="a_prstClr" />
                          </span>
                        </span>
                      </span>
                      <span className="wps_txbx" />
                    </span>
                  </span>
                </span>
              </span>
            </span>
          </span>
        </span>
      </span>
    </p>
    <aside>
      <div className="dedocx-caption" data-dedocx-caption-group="r36hfKg28q">
        <p
          data-dedocx-props={{
            elementType: 'para',
            keepNext: true,
            pStyle: 'Caption'
          }}
        >
          <span className="dedocx-label">
            Text Box{' '}
            <span
              data-w_instr=" SEQ Text_Box \* ARABIC "
              className="w_fldSimple"
            >
              <span data-dedocx-props={{ elementType: 'run', noProof: true }}>
                1
              </span>
            </span>
          </span>{' '}
          A text box caption.
        </p>
      </div>
      <h2 data-dedocx-props={{ elementType: 'para', pStyle: 'Heading2' }}>
        Text Box Heading
      </h2>
      <p>A text box with only text and a heading.</p>
    </aside>
    <span
      data-rot="0"
      data-spcfirstlastpara="0"
      data-vertoverflow="overflow"
      data-horzoverflow="overflow"
      data-vert="horz"
      data-wrap="square"
      data-lins="91440"
      data-tins="45720"
      data-rins="91440"
      data-bins="45720"
      data-numcol="1"
      data-spccol="0"
      data-rtlcol="0"
      data-fromwordart="0"
      data-anchor="t"
      data-anchorctr="0"
      data-forceaa="0"
      data-compatlnspc="1"
      className="wps_bodyPr"
    >
      <span data-prst="textNoShape" className="a_prstTxWarp">
        <span className="a_avLst" />
      </span>
      <span className="a_noAutofit" />
    </span>
    <span className="mc_Fallback">
      <span className="w_pict">
        <span
          data-w14_anchorid="509ED463"
          data-id="_x0000_t202"
          data-coordsize="21600,21600"
          data-o_spt="202"
          data-path="m,l,21600r21600,l21600,xe"
          className="v_shapetype"
        >
          <span data-joinstyle="miter" className="v_stroke" />
          <span
            data-gradientshapeok="t"
            data-o_connecttype="rect"
            className="v_path"
          />
        </span>
        <span
          data-id="Text Box 4"
          data-o_spid="_x0000_s1026"
          data-type="#_x0000_t202"
          data-style="width:251.35pt;height:73.65pt;visibility:visible;mso-wrap-style:square;mso-left-percent:-10001;mso-top-percent:-10001;mso-position-horizontal:absolute;mso-position-horizontal-relative:char;mso-position-vertical:absolute;mso-position-vertical-relative:line;mso-left-percent:-10001;mso-top-percent:-10001;v-text-anchor:top"
          data-o_gfxdata="UEsDBBQABgAIAAAAIQC2gziS/gAAAOEBAAATAAAAW0NvbnRlbnRfVHlwZXNdLnhtbJSRQU7DMBBF
90jcwfIWJU67QAgl6YK0S0CoHGBkTxKLZGx5TGhvj5O2G0SRWNoz/78nu9wcxkFMGNg6quQqL6RA
0s5Y6ir5vt9lD1JwBDIwOMJKHpHlpr69KfdHjyxSmriSfYz+USnWPY7AufNIadK6MEJMx9ApD/oD
OlTrorhX2lFEilmcO2RdNtjC5xDF9pCuTyYBB5bi6bQ4syoJ3g9WQ0ymaiLzg5KdCXlKLjvcW893
SUOqXwnz5DrgnHtJTxOsQfEKIT7DmDSUCaxw7Rqn8787ZsmRM9e2VmPeBN4uqYvTtW7jvijg9N/y
JsXecLq0q+WD6m8AAAD//wMAUEsDBBQABgAIAAAAIQA4/SH/1gAAAJQBAAALAAAAX3JlbHMvLnJl
bHOkkMFqwzAMhu+DvYPRfXGawxijTi+j0GvpHsDYimMaW0Yy2fr2M4PBMnrbUb/Q94l/f/hMi1qR
JVI2sOt6UJgd+ZiDgffL8ekFlFSbvV0oo4EbChzGx4f9GRdb25HMsYhqlCwG5lrLq9biZkxWOiqY
22YiTra2kYMu1l1tQD30/bPm3wwYN0x18gb45AdQl1tp5j/sFB2T0FQ7R0nTNEV3j6o9feQzro1i
OWA14Fm+Q8a1a8+Bvu/d/dMb2JY5uiPbhG/ktn4cqGU/er3pcvwCAAD//wMAUEsDBBQABgAIAAAA
IQBqMUMeTQIAAKEEAAAOAAAAZHJzL2Uyb0RvYy54bWysVE2P2jAQvVfqf7B8LyF8dUGEFWVFVQnt
rgTVno3jEKuOx7UNCf31HTuBZbc9Vb2Y8czL88ybGeb3TaXISVgnQWc07fUpEZpDLvUho9936093
lDjPdM4UaJHRs3D0fvHxw7w2MzGAElQuLEES7Wa1yWjpvZklieOlqJjrgREagwXYinm82kOSW1Yj
e6WSQb8/SWqwubHAhXPofWiDdBH5i0Jw/1QUTniiMoq5+XjaeO7DmSzmbHawzJSSd2mwf8iiYlLj
o1eqB+YZOVr5B1UluQUHhe9xqBIoCslFrAGrSfvvqtmWzIhYC4rjzFUm9/9o+ePp2RKZZ3REiWYV
tmgnGk++QENGQZ3auBmCtgZhvkE3dvnid+gMRTeFrcIvlkMwjjqfr9oGMo7OYTpNp8MhJRxj0+F4
MhkHmuT1a2Od/yqgIsHIqMXeRUnZaeN8C71AwmMOlMzXUql4CfMiVsqSE8NOKx9zRPI3KKVJndHJ
cNyPxG9igfr6/V4x/qNL7waFfEpjzkGTtvZg+WbfdELtIT+jThbaOXOGryXybpjzz8ziYKE0uCz+
CY9CASYDnUVJCfbX3/wBj/3GKCU1DmpG3c8js4IS9U3jJEzT0ShMdryMxp8HeLG3kf1tRB+rFaBC
Ka6l4dEMeK8uZmGhesGdWoZXMcQ0x7cz6i/myrfrgzvJxXIZQTjLhvmN3hoeqENHgp675oVZ0/XT
4yQ8wmWk2exdW1ts+FLD8uihkLHnQeBW1U533IM4Nd3OhkW7vUfU6z/L4jcAAAD//wMAUEsDBBQA
BgAIAAAAIQAOFkfP3gAAAAoBAAAPAAAAZHJzL2Rvd25yZXYueG1sTI9LT8MwEITvSPwHa5G4UYfy
aEjjVDxKL5woiLMbbx2LeB3Zbhr+PQsXuIy0mt3Z+erV5HsxYkwukILLWQECqQ3GkVXw/vZ8UYJI
WZPRfSBU8IUJVs3pSa0rE470iuM2W8EhlCqtoMt5qKRMbYdep1kYkNjbh+h15jFaaaI+crjv5bwo
bqXXjvhDpwd87LD93B68gvWDvbNtqWO3Lo1z4/Sxf7Ebpc7Ppqcly/0SRMYp/13ADwP3h4aL7cKB
TBK9AqbJv8reTTFfgNjx0vXiCmRTy/8IzTcAAAD//wMAUEsBAi0AFAAGAAgAAAAhALaDOJL+AAAA
4QEAABMAAAAAAAAAAAAAAAAAAAAAAFtDb250ZW50X1R5cGVzXS54bWxQSwECLQAUAAYACAAAACEA
OP0h/9YAAACUAQAACwAAAAAAAAAAAAAAAAAvAQAAX3JlbHMvLnJlbHNQSwECLQAUAAYACAAAACEA
ajFDHk0CAAChBAAADgAAAAAAAAAAAAAAAAAuAgAAZHJzL2Uyb0RvYy54bWxQSwECLQAUAAYACAAA
ACEADhZHz94AAAAKAQAADwAAAAAAAAAAAAAAAACnBAAAZHJzL2Rvd25yZXYueG1sUEsFBgAAAAAE
AAQA8wAAALIFAAAAAA==
"
          data-fillcolor="white [3201]"
          data-strokeweight=".5pt"
          className="v_shape"
        >
          <span className="v_textbox">
            <aside>
              <div
                className="dedocx-caption"
                data-dedocx-caption-group="SZEnB_Ybtl"
              >
                <p
                  data-dedocx-props={{
                    elementType: 'para',
                    keepNext: true,
                    pStyle: 'Caption'
                  }}
                >
                  <span className="dedocx-label">
                    Text Box{' '}
                    <span
                      data-w_instr=" SEQ Text_Box \* ARABIC "
                      className="w_fldSimple"
                    >
                      <span
                        data-dedocx-props={{
                          elementType: 'run',
                          noProof: true
                        }}
                      >
                        1
                      </span>
                    </span>
                  </span>{' '}
                  A text box caption.
                </p>
              </div>
              <h2
                data-dedocx-props={{ elementType: 'para', pStyle: 'Heading2' }}
              >
                Text Box Heading
              </h2>
              <p>A text box with only text and a heading.</p>
            </aside>
          </span>
          <span className="w10_anchorlock" />
        </span>
      </span>
    </span>
    <p />
    <p />
    <p>
      <span data-dedocx-props={{ elementType: 'run', noProof: true }}>
        <span className="mc_AlternateContent">
          <span data-requires="wps" className="mc_Choice">
            <span className="w_drawing">
              <span
                data-distt="0"
                data-distb="0"
                data-distl="0"
                data-distr="0"
                data-wp14_anchorid="7164AB0A"
                data-wp14_editid="13C8DBC0"
                className="wp_inline"
              >
                <span
                  data-cx="5305647"
                  data-cy="2892056"
                  className="wp_extent"
                />
                <span
                  data-l="0"
                  data-t="0"
                  data-r="15875"
                  data-b="16510"
                  className="wp_effectExtent"
                />
                <span data-id="6" data-name="Text Box 6" className="wp_docPr" />
                <span className="wp_cNvGraphicFramePr" />
                <span
                  data-xmlns_a="http://schemas.openxmlformats.org/drawingml/2006/main"
                  className="a_graphic"
                >
                  <span
                    data-uri="http://schemas.microsoft.com/office/word/2010/wordprocessingShape"
                    className="a_graphicData"
                  >
                    <span className="wps_wsp">
                      <span data-txbox="1" className="wps_cNvSpPr" />
                      <span className="wps_spPr">
                        <span className="a_xfrm">
                          <span data-x="0" data-y="0" className="a_off" />
                          <span
                            data-cx="5305647"
                            data-cy="2892056"
                            className="a_ext"
                          />
                        </span>
                        <span data-prst="rect" className="a_prstGeom">
                          <span className="a_avLst" />
                        </span>
                        <span className="a_solidFill">
                          <span data-val="lt1" className="a_schemeClr" />
                        </span>
                        <span data-w="6350" className="a_ln">
                          <span className="a_solidFill">
                            <span data-val="black" className="a_prstClr" />
                          </span>
                        </span>
                      </span>
                      <span className="wps_txbx" />
                    </span>
                  </span>
                </span>
              </span>
            </span>
          </span>
        </span>
      </span>
    </p>
    <aside>
      <div className="dedocx-caption" data-dedocx-caption-group="d5uTqxBSqZ">
        <p
          data-dedocx-props={{
            elementType: 'para',
            keepNext: true,
            pStyle: 'Caption'
          }}
        >
          <span className="dedocx-label">
            Text Box{' '}
            <span
              data-w_instr=" SEQ Text_Box \* ARABIC "
              className="w_fldSimple"
            >
              <span data-dedocx-props={{ elementType: 'run', noProof: true }}>
                2
              </span>
            </span>
          </span>{' '}
          A textbox with uncaptioned images.
        </p>
      </div>
      <p>
        Inline image{' '}
        <span data-dedocx-props={{ elementType: 'run', noProof: true }}>
          <span className="w_drawing">
            <span
              data-distt="0"
              data-distb="0"
              data-distl="0"
              data-distr="0"
              data-wp14_anchorid="1D44F947"
              data-wp14_editid="7A1BEA16"
              className="wp_inline"
            >
              <span data-cx="1967023" data-cy="336491" className="wp_extent" />
              <span
                data-l="0"
                data-t="0"
                data-r="1905"
                data-b="0"
                className="wp_effectExtent"
              />
              <span data-id="8" data-name="Picture 8" className="wp_docPr" />
              <span className="wp_cNvGraphicFramePr">
                <span
                  data-xmlns_a="http://schemas.openxmlformats.org/drawingml/2006/main"
                  data-nochangeaspect="1"
                  className="a_graphicFrameLocks"
                />
              </span>
              <span
                data-xmlns_a="http://schemas.openxmlformats.org/drawingml/2006/main"
                className="a_graphic"
              >
                <span
                  data-uri="http://schemas.openxmlformats.org/drawingml/2006/picture"
                  className="a_graphicData"
                >
                  <span
                    data-xmlns_pic="http://schemas.openxmlformats.org/drawingml/2006/picture"
                    className="pic_pic"
                  >
                    <span className="pic_nvPicPr">
                      <span
                        data-id="5"
                        data-name="sparkline_d3_angular.png"
                        className="pic_cNvPr"
                      />
                      <span className="pic_cNvPicPr" />
                    </span>
                    <span className="pic_blipFill">
                      <img
                        src="/var/folders/pr/7r562dtd7q5dnkg_wx6tfwsm0000gn/T/tmp-2515O3MLLHgLj3nV/word/media/image8.png"
                        data-dedocx-rel-target="media/image8.png"
                        data-dedocx-rel-package-path="/word/media/image8.png"
                      />
                      <span className="a_stretch">
                        <span className="a_fillRect" />
                      </span>
                    </span>
                    <span className="pic_spPr">
                      <span className="a_xfrm">
                        <span data-x="0" data-y="0" className="a_off" />
                        <span
                          data-cx="2073825"
                          data-cy="354761"
                          className="a_ext"
                        />
                      </span>
                      <span data-prst="rect" className="a_prstGeom">
                        <span className="a_avLst" />
                      </span>
                    </span>
                  </span>
                </span>
              </span>
            </span>
          </span>
        </span>
      </p>
      <p />
      <p />
      <p>
        <span data-dedocx-props={{ elementType: 'run', noProof: true }}>
          <span className="w_drawing">
            <span
              data-distt="0"
              data-distb="0"
              data-distl="0"
              data-distr="0"
              data-wp14_anchorid="1BF05145"
              data-wp14_editid="07B5B2E6"
              className="wp_inline"
            >
              <span data-cx="2753404" data-cy="1712598" className="wp_extent" />
              <span
                data-l="0"
                data-t="0"
                data-r="2540"
                data-b="1905"
                className="wp_effectExtent"
              />
              <span data-id="10" data-name="Picture 10" className="wp_docPr" />
              <span className="wp_cNvGraphicFramePr">
                <span
                  data-xmlns_a="http://schemas.openxmlformats.org/drawingml/2006/main"
                  data-nochangeaspect="1"
                  className="a_graphicFrameLocks"
                />
              </span>
              <span
                data-xmlns_a="http://schemas.openxmlformats.org/drawingml/2006/main"
                className="a_graphic"
              >
                <span
                  data-uri="http://schemas.openxmlformats.org/drawingml/2006/picture"
                  className="a_graphicData"
                >
                  <span
                    data-xmlns_pic="http://schemas.openxmlformats.org/drawingml/2006/picture"
                    className="pic_pic"
                  >
                    <span className="pic_nvPicPr">
                      <span
                        data-id="10"
                        data-name="Picture1.png"
                        className="pic_cNvPr"
                      />
                      <span className="pic_cNvPicPr" />
                    </span>
                    <span className="pic_blipFill">
                      <img
                        src="/var/folders/pr/7r562dtd7q5dnkg_wx6tfwsm0000gn/T/tmp-2515O3MLLHgLj3nV/word/media/image9.png"
                        data-dedocx-rel-target="media/image9.png"
                        data-dedocx-rel-package-path="/word/media/image9.png"
                      />
                      <span className="a_stretch">
                        <span className="a_fillRect" />
                      </span>
                    </span>
                    <span className="pic_spPr">
                      <span className="a_xfrm">
                        <span data-x="0" data-y="0" className="a_off" />
                        <span
                          data-cx="2770185"
                          data-cy="1723036"
                          className="a_ext"
                        />
                      </span>
                      <span data-prst="rect" className="a_prstGeom">
                        <span className="a_avLst" />
                      </span>
                    </span>
                  </span>
                </span>
              </span>
            </span>
          </span>
        </span>{' '}
      </p>
      <p />
    </aside>
    <span
      data-rot="0"
      data-spcfirstlastpara="0"
      data-vertoverflow="overflow"
      data-horzoverflow="overflow"
      data-vert="horz"
      data-wrap="square"
      data-lins="91440"
      data-tins="45720"
      data-rins="91440"
      data-bins="45720"
      data-numcol="1"
      data-spccol="0"
      data-rtlcol="0"
      data-fromwordart="0"
      data-anchor="t"
      data-anchorctr="0"
      data-forceaa="0"
      data-compatlnspc="1"
      className="wps_bodyPr"
    >
      <span data-prst="textNoShape" className="a_prstTxWarp">
        <span className="a_avLst" />
      </span>
      <span className="a_noAutofit" />
    </span>
    <span className="mc_Fallback">
      <span className="w_pict">
        <span
          data-w14_anchorid="7164AB0A"
          data-id="Text Box 6"
          data-o_spid="_x0000_s1027"
          data-type="#_x0000_t202"
          data-style="width:417.75pt;height:227.7pt;visibility:visible;mso-wrap-style:square;mso-left-percent:-10001;mso-top-percent:-10001;mso-position-horizontal:absolute;mso-position-horizontal-relative:char;mso-position-vertical:absolute;mso-position-vertical-relative:line;mso-left-percent:-10001;mso-top-percent:-10001;v-text-anchor:top"
          data-o_gfxdata="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
AAQA8wAAALIFAAAAAA==
"
          data-fillcolor="white [3201]"
          data-strokeweight=".5pt"
          className="v_shape"
        >
          <span className="v_textbox">
            <aside>
              <div
                className="dedocx-caption"
                data-dedocx-caption-group="ezyN7U4eVe"
              >
                <p
                  data-dedocx-props={{
                    elementType: 'para',
                    keepNext: true,
                    pStyle: 'Caption'
                  }}
                >
                  <span className="dedocx-label">
                    Text Box{' '}
                    <span
                      data-w_instr=" SEQ Text_Box \* ARABIC "
                      className="w_fldSimple"
                    >
                      <span
                        data-dedocx-props={{
                          elementType: 'run',
                          noProof: true
                        }}
                      >
                        2
                      </span>
                    </span>
                  </span>{' '}
                  A textbox with uncaptioned images.
                </p>
              </div>
              <p>
                Inline image{' '}
                <span data-dedocx-props={{ elementType: 'run', noProof: true }}>
                  <span className="w_drawing">
                    <span
                      data-distt="0"
                      data-distb="0"
                      data-distl="0"
                      data-distr="0"
                      data-wp14_anchorid="1D44F947"
                      data-wp14_editid="7A1BEA16"
                      className="wp_inline"
                    >
                      <span
                        data-cx="1967023"
                        data-cy="336491"
                        className="wp_extent"
                      />
                      <span
                        data-l="0"
                        data-t="0"
                        data-r="1905"
                        data-b="0"
                        className="wp_effectExtent"
                      />
                      <span
                        data-id="8"
                        data-name="Picture 8"
                        className="wp_docPr"
                      />
                      <span className="wp_cNvGraphicFramePr">
                        <span
                          data-xmlns_a="http://schemas.openxmlformats.org/drawingml/2006/main"
                          data-nochangeaspect="1"
                          className="a_graphicFrameLocks"
                        />
                      </span>
                      <span
                        data-xmlns_a="http://schemas.openxmlformats.org/drawingml/2006/main"
                        className="a_graphic"
                      >
                        <span
                          data-uri="http://schemas.openxmlformats.org/drawingml/2006/picture"
                          className="a_graphicData"
                        >
                          <span
                            data-xmlns_pic="http://schemas.openxmlformats.org/drawingml/2006/picture"
                            className="pic_pic"
                          >
                            <span className="pic_nvPicPr">
                              <span
                                data-id="5"
                                data-name="sparkline_d3_angular.png"
                                className="pic_cNvPr"
                              />
                              <span className="pic_cNvPicPr" />
                            </span>
                            <span className="pic_blipFill">
                              <img
                                src="/var/folders/pr/7r562dtd7q5dnkg_wx6tfwsm0000gn/T/tmp-2515O3MLLHgLj3nV/word/media/image8.png"
                                data-dedocx-rel-target="media/image8.png"
                                data-dedocx-rel-package-path="/word/media/image8.png"
                              />
                              <span className="a_stretch">
                                <span className="a_fillRect" />
                              </span>
                            </span>
                            <span className="pic_spPr">
                              <span className="a_xfrm">
                                <span data-x="0" data-y="0" className="a_off" />
                                <span
                                  data-cx="2073825"
                                  data-cy="354761"
                                  className="a_ext"
                                />
                              </span>
                              <span data-prst="rect" className="a_prstGeom">
                                <span className="a_avLst" />
                              </span>
                            </span>
                          </span>
                        </span>
                      </span>
                    </span>
                  </span>
                </span>
              </p>
              <p />
              <p />
              <p>
                <span data-dedocx-props={{ elementType: 'run', noProof: true }}>
                  <span className="w_drawing">
                    <span
                      data-distt="0"
                      data-distb="0"
                      data-distl="0"
                      data-distr="0"
                      data-wp14_anchorid="1BF05145"
                      data-wp14_editid="07B5B2E6"
                      className="wp_inline"
                    >
                      <span
                        data-cx="2753404"
                        data-cy="1712598"
                        className="wp_extent"
                      />
                      <span
                        data-l="0"
                        data-t="0"
                        data-r="2540"
                        data-b="1905"
                        className="wp_effectExtent"
                      />
                      <span
                        data-id="10"
                        data-name="Picture 10"
                        className="wp_docPr"
                      />
                      <span className="wp_cNvGraphicFramePr">
                        <span
                          data-xmlns_a="http://schemas.openxmlformats.org/drawingml/2006/main"
                          data-nochangeaspect="1"
                          className="a_graphicFrameLocks"
                        />
                      </span>
                      <span
                        data-xmlns_a="http://schemas.openxmlformats.org/drawingml/2006/main"
                        className="a_graphic"
                      >
                        <span
                          data-uri="http://schemas.openxmlformats.org/drawingml/2006/picture"
                          className="a_graphicData"
                        >
                          <span
                            data-xmlns_pic="http://schemas.openxmlformats.org/drawingml/2006/picture"
                            className="pic_pic"
                          >
                            <span className="pic_nvPicPr">
                              <span
                                data-id="10"
                                data-name="Picture1.png"
                                className="pic_cNvPr"
                              />
                              <span className="pic_cNvPicPr" />
                            </span>
                            <span className="pic_blipFill">
                              <img
                                src="/var/folders/pr/7r562dtd7q5dnkg_wx6tfwsm0000gn/T/tmp-2515O3MLLHgLj3nV/word/media/image9.png"
                                data-dedocx-rel-target="media/image9.png"
                                data-dedocx-rel-package-path="/word/media/image9.png"
                              />
                              <span className="a_stretch">
                                <span className="a_fillRect" />
                              </span>
                            </span>
                            <span className="pic_spPr">
                              <span className="a_xfrm">
                                <span data-x="0" data-y="0" className="a_off" />
                                <span
                                  data-cx="2770185"
                                  data-cy="1723036"
                                  className="a_ext"
                                />
                              </span>
                              <span data-prst="rect" className="a_prstGeom">
                                <span className="a_avLst" />
                              </span>
                            </span>
                          </span>
                        </span>
                      </span>
                    </span>
                  </span>
                </span>{' '}
              </p>
              <p />
            </aside>
          </span>
          <span className="w10_anchorlock" />
        </span>
      </span>
    </span>
    <p />
    <p />
    <p
      data-dedocx-props={{ elementType: 'para', rPr: { rStyle: 'InlineCode' } }}
    >
      Inline code{' '}
      <code data-dedocx-props={{ elementType: 'run', rStyle: 'InlineCode' }}>
        str.length
      </code>
    </p>
    <p />
    <pre
      data-dedocx-props={{
        elementType: 'para',
        keepNext: true,
        pStyle: 'BlockCode'
      }}
      data-dedocx-caption-group="lTmab0QbU3"
      data-dedocx-caption-target-type="code"
    >
      <code># standard tests</code>
    </pre>
    <pre
      data-dedocx-props={{
        elementType: 'para',
        keepNext: true,
        pStyle: 'BlockCode'
      }}
    >
      <code>x &lt;- runif(100, 0, 10) # 100 draws from U(0,10)</code>
    </pre>
    <pre
      data-dedocx-props={{
        elementType: 'para',
        keepNext: true,
        pStyle: 'BlockCode'
      }}
    >
      <code>y &lt;- 2 + 3*x + rnorm(100) # beta = [2, 3] and sigma is 1</code>
    </pre>
    <pre
      data-dedocx-props={{
        elementType: 'para',
        keepNext: true,
        pStyle: 'BlockCode'
      }}
    >
      <code>d &lt;- lm(y ~ x)</code>
    </pre>
    <pre
      data-dedocx-props={{
        elementType: 'para',
        keepNext: true,
        pStyle: 'BlockCode'
      }}
    >
      <code>summary(d)</code>
    </pre>
    <div className="dedocx-caption" data-dedocx-caption-group="lTmab0QbU3">
      <p data-dedocx-props={{ elementType: 'para', pStyle: 'Caption' }}>
        <span className="dedocx-label">
          Code{' '}
          <span data-w_instr=" SEQ Code \* ARABIC " className="w_fldSimple">
            <span data-dedocx-props={{ elementType: 'run', noProof: true }}>
              1
            </span>
          </span>
        </span>{' '}
        Code block sample. Programming Language: R.
      </p>
    </div>
    <p />
    <p>
      An inline equation{' '}
      <math xmlns="http://www.w3.org/1998/Math/MathML" display="inline">
        <mi>x</mi>
        <mo>=</mo>
        <mfrac>
          <mrow>
            <mo>-</mo>
            <mi>b</mi>
            <mo>±</mo>
            <msqrt>
              <msup>
                <mrow>
                  <mi>b</mi>
                </mrow>
                <mrow>
                  <mn>2</mn>
                </mrow>
              </msup>
              <mo>-</mo>
              <mn>4</mn>
              <mi>a</mi>
              <mi>c</mi>
            </msqrt>
          </mrow>
          <mrow>
            <mn>2</mn>
            <mi>a</mi>
          </mrow>
        </mfrac>
      </math>
    </p>
    <div className="dedocx-caption" data-dedocx-caption-group="4v1gaVDhrE">
      <p
        data-dedocx-props={{
          elementType: 'para',
          keepNext: true,
          pStyle: 'Caption'
        }}
      >
        <span className="dedocx-label">
          Equation{' '}
          <span data-w_instr=" SEQ Equation \* ARABIC " className="w_fldSimple">
            <span data-dedocx-props={{ elementType: 'run', noProof: true }}>
              1
            </span>
          </span>
        </span>{' '}
        Binomial theorem.
      </p>
    </div>
    <p
      data-dedocx-caption-group="4v1gaVDhrE"
      data-dedocx-caption-target-type="math"
    >
      <math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
        <msup>
          <mrow>
            <mfenced separators="|">
              <mrow>
                <mi>x</mi>
                <mo>+</mo>
                <mi>a</mi>
              </mrow>
            </mfenced>
          </mrow>
          <mrow>
            <mi>n</mi>
          </mrow>
        </msup>
        <mo>=</mo>
        <mrow>
          <msubsup>
            <mo stretchy="true">∑</mo>
            <mrow>
              <mi>k</mi>
              <mo>=</mo>
              <mn>0</mn>
            </mrow>
            <mrow>
              <mi>n</mi>
            </mrow>
          </msubsup>
          <mrow>
            <mfenced separators="|">
              <mrow>
                <mfrac linethickness="0pt">
                  <mrow>
                    <mi>n</mi>
                  </mrow>
                  <mrow>
                    <mi>k</mi>
                  </mrow>
                </mfrac>
              </mrow>
            </mfenced>
            <msup>
              <mrow>
                <mi>x</mi>
              </mrow>
              <mrow>
                <mi>k</mi>
              </mrow>
            </msup>
            <msup>
              <mrow>
                <mi>a</mi>
              </mrow>
              <mrow>
                <mi>n</mi>
                <mo>-</mo>
                <mi>k</mi>
              </mrow>
            </msup>
          </mrow>
        </mrow>
      </math>
    </p>
    <p />
    <p
      data-dedocx-props={{ elementType: 'para', keepNext: true }}
      data-dedocx-caption-group="uVBwlDa6Vr"
      data-dedocx-caption-target-type="hyper"
    >
      <a
        data-w_history="1"
        data-sans_rel={{
          id: 'rId24',
          type:
            'http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink',
          target: 'https://www.ncbi.nlm.nih.gov/nuccore/NC_012532.1',
          targetMode: 'external',
          fullPath:
            '/var/folders/pr/7r562dtd7q5dnkg_wx6tfwsm0000gn/T/tmp-2515O3MLLHgLj3nV/word/https:/www.ncbi.nlm.nih.gov/nuccore/NC_012532.1',
          packagePath: '/word/https:/www.ncbi.nlm.nih.gov/nuccore/NC_012532.1'
        }}
        href="https://www.ncbi.nlm.nih.gov/nuccore/NC_012532.1"
      >
        <span data-dedocx-props={{ elementType: 'run', rStyle: 'Hyperlink' }}>
          https://www.ncbi.nlm.nih.gov/nuccore/NC_012532.1
        </span>
      </a>
    </p>
    <div className="dedocx-caption" data-dedocx-caption-group="uVBwlDa6Vr">
      <p data-dedocx-props={{ elementType: 'para', pStyle: 'Caption' }}>
        <span className="dedocx-label">
          Supporting Dataset{' '}
          <span
            data-w_instr=" SEQ Supporting_Dataset \* ARABIC "
            className="w_fldSimple"
          >
            <span data-dedocx-props={{ elementType: 'run', noProof: true }}>
              1
            </span>
          </span>
        </span>{' '}
        Genbank.
      </p>
    </div>
    <section
      role="doc-bibliography"
      data-dedocx-props={{
        elementType: 'para',
        id: '1414044961',
        rPr: {
          sz: 24,
          szCs: 24,
          color: { val: 'auto' },
          rFonts: {
            asciiTheme: 'minorHAnsi',
            hAnsiTheme: 'minorHAnsi',
            eastAsiaTheme: 'minorHAnsi',
            cstheme: 'minorBidi'
          }
        },
        docPartObj: { docPartGallery: 'Bibliographies', docPartUnique: true }
      }}
    >
      <h1
        data-dedocx-props={{
          elementType: 'para',
          pStyle: 'Heading1',
          rPr: { rStyle: 'Heading2Char' }
        }}
      >
        <span
          data-dedocx-props={{ elementType: 'run', rStyle: 'Heading2Char' }}
        >
          References
        </span>
      </h1>
      <span
        data-dedocx-props={{
          elementType: 'para',
          bibliography: true,
          id: '111145805'
        }}
      >
        <p
          data-dedocx-props={{
            elementType: 'para',
            pStyle: 'Bibliography',
            rPr: { noProof: true }
          }}
        >
          <span data-dedocx-props={{ elementType: 'run', noProof: true }}>
            Kilpatrick, A. M., 2011. Globalization, Land Use, and the Invasion
            of West Nile Virus.{' '}
          </span>
          <em
            data-dedocx-props={{ elementType: 'run', iCs: true, noProof: true }}
          >
            Science,{' '}
          </em>
          <span data-dedocx-props={{ elementType: 'run', noProof: true }}>
            21 October, 334(6054), pp. 323-327.
          </span>
        </p>
        <p />
      </span>
    </section>
    <p />
    <section role="dedocx-footnotes">
      <div role="doc-footnote" id="dedocx-footnote-1">
        <p data-dedocx-props={{ elementType: 'para', pStyle: 'FootnoteText' }}>
          <sup
            data-dedocx-props={{
              elementType: 'run',
              rStyle: 'FootnoteReference'
            }}
          >
            1
          </sup>{' '}
          A footnote
        </p>
      </div>
      <div role="doc-footnote" id="dedocx-footnote-2">
        <p data-dedocx-props={{ elementType: 'para', pStyle: 'FootnoteText' }}>
          <sup
            data-dedocx-props={{
              elementType: 'run',
              rStyle: 'FootnoteReference'
            }}
          >
            2
          </sup>{' '}
          Table footnote
        </p>
      </div>
    </section>
    <section role="doc-endnotes">
      <div role="doc-endnote" id="dedocx-endnote-1">
        <p data-dedocx-props={{ elementType: 'para', pStyle: 'EndnoteText' }}>
          <sup
            data-dedocx-props={{
              elementType: 'run',
              rStyle: 'EndnoteReference'
            }}
          >
            1
          </sup>{' '}
          An endnote
        </p>
      </div>
    </section>
  </body>
);
