
import { HTMLToken } from './html.mjs';

import tagName from './tagName.mjs';

/**
 * endTag = "</" , tagName , ">" ;
 * @param source source string
 * @param cursor matching index
 */
function endTag(source: string, cursor: number): { cursor: number, token: HTMLToken | null }{

  const error = (...args: any[])=>console.error('[endTag]', ...args);

  const head = cursor;
  const token = { type: 'end' as 'end', tagName: '' };
  let result: { cursor: number, value: string };

  // "</"
  if(source.substring(cursor, cursor + 2) != '</'){
    error('endTag is start from "</"');
    return { cursor: head , token: null };
  }
  cursor += 2;

  // tagName
  result = tagName(source, cursor);
  if(!result.value){
    error('invalid tagName detected');
    return { cursor: head , token: null };
  }
  cursor = result.cursor;
  token.tagName = result.value;

  // ">"
  if(source[cursor] != '>'){
    error('startTag is not end with ">"');
    return { cursor: head, token: null };
  }
  cursor++;
  
  return { cursor, token };
}

export default endTag;
