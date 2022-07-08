
import { HTMLToken } from './html.mjs';

/**
 * comment = "<!--" , comment-text , "-->" ;
 * comment-text = ? ">" または "->" で始まらず、 間に "<--" を含まず、 "<!-" で終わらない ? ;
 * @param source source string
 * @param cursor matching index
 */
function comment(source: string, cursor: number): { cursor: number, token: HTMLToken | null }{

  const head = cursor;
  const token = { type: 'comment' as 'comment', value: '' };

  // "<!--"
  if(source.substring(cursor, cursor + 4) != '<!--'){
    return { cursor: head, token: null };
  }
  cursor += 4;

  // "-->"
  const endRegex = /-->/g;
  endRegex.lastIndex = cursor;
  const endResult = endRegex.exec(source);
  if(!endResult){
    return { cursor: head, token: null };
  }
  token.value = source.substring(cursor, endResult.index);
  cursor = endResult.index + 3;

  // comment-text
  if(/^(>|->)/.test(token.value) || /(<--|--!>)/.test(token.value) || /<!-$/.test(token.value)){
    return { cursor: head, token: null };
  }

  return { cursor, token };
}

export default comment;
