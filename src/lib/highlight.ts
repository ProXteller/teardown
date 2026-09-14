/**
 * Tiny language-agnostic highlighter: good enough to make snippets readable on a phone
 * without shipping a full grammar engine.
 */

export type TokenType = 'plain' | 'comment' | 'string' | 'keyword' | 'number' | 'type' | 'tag' | 'fn';

export interface Token {
  type: TokenType;
  text: string;
}

const KEYWORDS = new Set(
  (
    'abstract and as async await break case catch class const continue def default defer delete do elif else enum export extends ' +
    'extension false final finally fn for from func fun function go guard if impl import in instanceof interface is let loop match ' +
    'module mut new nil not null object of or override package pass private protected pub public raise receive return select self ' +
    'static struct super switch this throw throws true try type typeof use val var void when where while with yield ' +
    'SELECT FROM WHERE INSERT INTO VALUES UPDATE SET DELETE CREATE TABLE PRIMARY KEY INDEX JOIN ON GROUP BY ORDER LIMIT AND OR NOT NULL ' +
    'end defmodule defp do case cond fn receive spawn alias require'
  ).split(' '),
);

const PATTERN =
  /(\/\/[^\n]*|#(?![{!])[^\n]*|--[^\n]*|\/\*[\s\S]*?\*\/|<!--[\s\S]*?-->)|("(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'|`(?:[^`\\]|\\.)*`)|(\b\d+(?:\.\d+)?\b)|(<\/?[a-zA-Z][\w-]*|\/?>)|([A-Za-z_][\w]*)(?=\s*\()|([A-Za-z_@:][\w]*)/g;

export function tokenize(code: string, language: string): Token[] {
  const lang = language.toLowerCase();
  const hashComments = /python|ruby|elixir|shell|bash|yaml|toml|dockerfile|r\b/.test(lang);
  const dashComments = /sql|cql|lua|haskell/.test(lang);
  const tokens: Token[] = [];
  const re = new RegExp(PATTERN.source, 'g');
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(code))) {
    const index = m.index;
    if (index > last) tokens.push({ type: 'plain', text: code.slice(last, index) });
    const [text, comment, str, num, tag, fn, word] = m;
    if (comment) {
      const isHash = comment.startsWith('#');
      const isDash = comment.startsWith('--');
      if ((isHash && !hashComments) || (isDash && !dashComments)) {
        // Not a comment in this language: emit the marker and rescan right after it
        const len = isDash ? 2 : 1;
        tokens.push({ type: 'plain', text: comment.slice(0, len) });
        last = index + len;
        re.lastIndex = last;
        continue;
      }
      tokens.push({ type: 'comment', text });
    } else if (str) tokens.push({ type: 'string', text });
    else if (num) tokens.push({ type: 'number', text });
    else if (tag) tokens.push({ type: 'tag', text });
    else if (fn) tokens.push({ type: KEYWORDS.has(fn) ? 'keyword' : 'fn', text });
    else if (word) {
      if (KEYWORDS.has(word)) tokens.push({ type: 'keyword', text });
      else if (/^[A-Z][a-z0-9]+[A-Za-z0-9]*$/.test(word)) tokens.push({ type: 'type', text });
      else tokens.push({ type: 'plain', text });
    } else tokens.push({ type: 'plain', text });
    last = index + text.length;
  }
  if (last < code.length) tokens.push({ type: 'plain', text: code.slice(last) });
  return tokens;
}

export const TOKEN_COLORS: Record<TokenType, string> = {
  plain: '#DCE3F5',
  comment: '#5F6C8A',
  string: '#7CFFB2',
  keyword: '#FF7AB6',
  number: '#FFC857',
  type: '#5EE7FF',
  tag: '#A78BFA',
  fn: '#8FB8FF',
};
