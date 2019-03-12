import assert from 'assert';
import path from 'path';
import dedocx from '../src';
import { readFileSync } from 'fs';

describe('Bibliography', () => {
  const sourcePath = path.join(__dirname, 'fixtures/list-of-citations.docx');
  let bibliography;

  before(done => {
    dedocx({ sourcePath }, (err, ctx) => {
      if (err) {
        return done(err);
      }
      bibliography = ctx.bibliography;

      // require('fs').writeFileSync(
      //   'test/fixtures/expected-bibliography.json',
      //   JSON.stringify(bibliography)
      // );

      done();
    });
  });

  it('should extract all fields', () => {
    const expectedBibliography = readFileSync(
      'test/fixtures/expected-bibliography.json'
    );

    // console.log(require('util').inspect(bibliography, { depth: null }));
    assert.deepEqual(bibliography, JSON.parse(expectedBibliography));
  });
});

describe('Bibliography persons', () => {
  const sourcePath = path.join(
    __dirname,
    'fixtures/citation-container-author.docx'
  );
  let bibliography;

  before(done => {
    dedocx({ sourcePath }, (err, ctx) => {
      if (err) {
        return done(err);
      }
      bibliography = ctx.bibliography;
      done();
    });
  });

  it('should extract persons', () => {
    let entities = {
      Editor: [],
      Translator: [],
      BookAuthor: [],
      Composer: [],
      Director: [],
      Interviewer: []
    };

    Object.keys(bibliography).forEach(k => {
      Object.keys(bibliography[k])
        .filter(ck => entities[ck])
        .forEach(ck => {
          entities[ck] = entities[ck].concat(bibliography[k][ck]);
        });
    });

    const expectedEntities = {
      Editor: [
        { Person: [{ First: 'D.', Last: 'Costolo' }] },
        { Person: [{ First: 'B.', Last: 'Dorf' }] },
        { Person: [{ First: 'S.', Last: 'Blank' }] },
        { Person: [{ First: 'BT', Last: 'Grenfell' }] },
        { Person: [{ First: 'B.', Last: 'Obama' }] },
        { Person: [{ First: 'E.', Last: 'Wysocan' }] },
        { Person: [{ First: 'G.R.', Last: 'Martin' }] },
        { Person: [{ First: 'M.', Last: 'Gaitskill' }] },
        { Person: [{ First: 'J.', Last: 'Interlego' }] },
        { Person: [{ First: 'A.', Last: 'Fortas' }] }
      ],
      Translator: [
        { Person: [{ First: 'A.', Last: 'Iskold' }] },
        { Person: [{ First: 'A.', Last: 'Iskold' }] },
        { Person: [{ First: 'C.', Last: 'Shriky' }] },
        { Person: [{ First: 'Roger', Last: 'Sony' }] },
        { Person: [{ First: 'H.', Last: 'Black' }] }
      ],
      BookAuthor: [
        { Person: [{ First: 'B.', Last: 'Feld' }] },
        { Person: [{ First: 'J.', Last: 'Mendelson' }] }
      ],
      Composer: [{ Person: [{ First: 'L.', Last: 'Bernstein' }] }],
      Director: [
        { Person: [{ First: 'H.', Last: 'Klein' }] },
        { Person: [{ First: 'B.', Last: 'Singer' }] }
      ],
      Interviewer: [
        { Person: [{ First: 'D', Last: 'Salawak' }] },
        { Person: [{ First: 'P.', Last: 'Borgo' }] }
      ]
    };

    assert.deepEqual(entities, expectedEntities);
  });

  it('should extract keys for all references', () => {
    assert.equal(Object.keys(bibliography).length, 15);
  });
});
