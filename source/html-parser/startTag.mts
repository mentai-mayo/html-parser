
import { HTMLToken } from './html.mjs';

import tagName from './tagName.mjs';
import tagAttrKey from './tagAttributeKey.mjs';
import tagAttrValue from './tagAttributeValue.mjs';

/**
 * startTag = "<" , tagName , { "\s" , { "\s" } , tagAttributeKey , [ "=" , tagAttributeValue ] } , ">" ;
 * @param source source string
 * @param cursor matching index
 */
function startTag(source: string, cursor: number): { cursor: number, token: HTMLToken | null }{

  const error = (...args: any[])=>console.error('[startTag]', ...args);

  const head = cursor;
  const token = { type: 'start' as 'start', tagName: '', attributes: {} as { [key: string]: string } };
  let result: { cursor: number, value: string };

  // "<"
  if(source[cursor] != '<'){
    error('starTag isnot start from "<"');
    return { cursor: head, token: null };
  }
  cursor++;

  // tagName
  result = tagName(source, cursor);
  if(!result.value){
    error('invalid tagname detected');
    return { cursor: head, token: null };
  }
  cursor = result.cursor;
  token.tagName = result.value;

  // {
  while(source[cursor] && /\s/.test(source[cursor] as string)){

    let key = ``;

    // "\s" , { "\s" } -> use whitespaces
    const wsRegexp = /[^\s]/g;
    wsRegexp.lastIndex = cursor;
    const wsResult = wsRegexp.exec(source);
    if(!wsResult){
      error('whitespace continues to the end');
      return { cursor: head, token: null };
    }
    cursor = wsResult.index;

    // tagAttributeKey
    result = tagAttrKey(source, cursor);
    if(!result.value){
      error('invalid tagAttributeKey detected');
      return { cursor: head, token: null };
    }
    cursor = result.cursor;
    key = result.value;

    // [
    if(source[cursor] == '='){
      // "="
      cursor++;

      // tagAttributeValue
      result = tagAttrValue(source, cursor);
      if(!result.value){
        error('invalid tagAttributeValue detected');
        return { cursor: head, token: null };
      }
      cursor = result.cursor;
      token.attributes[key] = result.value;

      // ]
    } else{
      token.attributes[key] = key;
    }

    // }
  }

  // ">"
  if(source[cursor] != '>'){
    error('startTag is not end with ">"');
    return { cursor: head, token: null };
  }
  cursor++;
  
  return { cursor, token };
}

export default startTag;
