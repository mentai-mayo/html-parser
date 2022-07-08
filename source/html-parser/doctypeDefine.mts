
import { HTMLToken } from './html.mjs';

/**
 * doctypeDefine = "<!DOCTYPE" , "\s" , { "\s" } , doctype-root , [ "\s" , { "\s" } , ( "SYSTEM" | ( "PUBLIC" , "\s" , { "\s" } , ident , "\s" , { "\s" } ) ) , uri ] , ">" ;
 * @param source source string
 * @param cursor matching index
 */
function doctypeDefine(source: string, cursor: number): { cursor: number, token: HTMLToken | null }{
  
  const error = (...args: any[])=>console.error('[doctypeDefine]', ...args);

  const head = cursor;
  const token: { type: 'doctype', dtd: { root: string } | { root: string, specifier: 'system', uri: string } | { root: string, specifier: 'public', ident: string, uri: string } } = { type: 'doctype', dtd: { root: '' } };
  let result: { cursor: number, value: string };

  // "<!DOCTYPE"
  if(source.substring(cursor, cursor + 9) != '<!DOCTYPE'){
    error('doctypeDifinition must start with "<!DOCTYPE"');
    return { cursor: head, token: null };
  }
  cursor += 9;

  // "\s" , { "\s" }
  if(!source[cursor] || !/\s/.test(source[cursor] as string)){
    error('whitespace is not exist');
    return { cursor: head, token: null };
  }
  const wsRegexp = /[^\s]/g;
  wsRegexp.lastIndex = cursor;
  const wsResult = wsRegexp.exec(source);
  if(!wsResult){
    error('whitespace continues to the end');
    return { cursor: head, token: null };
  }
  cursor = wsResult.index;

  // doctype-root
  result = root(source, cursor);
  if(!result.value){
    error('invalid root-element detected');
    return { cursor: head, token: null };
  }
  cursor = result.cursor;
  token.dtd.root = result.value;

  // [
  if(source[cursor] && /\s/.test(source[cursor] as string)){

    // "\s" , { "\s" }
    if(!source[cursor] || !/\s/.test(source[cursor] as string)){
      error('whitespace is not exist');
      return { cursor: head, token: null };
    }
    const wsRegexp = /[^\s]/g;
    wsRegexp.lastIndex = cursor;
    const wsResult = wsRegexp.exec(source);
    if(!wsResult){
      error('whitespace continues to the end');
      return { cursor: head, token: null };
    }
    cursor = wsResult.index;

    // ( "SYSTEM" | ( "PUBLIC"
    if(source[cursor] && source.substring(cursor, cursor + 6) == 'SYSTEM'){

      // "SYSTEM"
      token.dtd = {
        root: token.dtd.root,
        specifier: 'system',
        uri: '',
      };

      cursor += 6;
    } else if(source[cursor] && source.substring(cursor, cursor + 6) == 'PUBLIC'){

      // "PUBLIC"
      token.dtd = {
        root: token.dtd.root,
        specifier: 'public',
        ident: '',
        uri: '',
      };

      cursor += 6;

      // "\s" , { "\s" }
      if(!source[cursor] || !/\s/.test(source[cursor] as string)){
        error('whitespace is not exist');
        return { cursor: head, token: null };
      }
      const wsRegexp = /[^\s]/g;
      wsRegexp.lastIndex = cursor;
      let wsResult = wsRegexp.exec(source);
      if(!wsResult){
        error('whitespace continues to the end');
        return { cursor: head, token: null };
      }
      cursor = wsResult.index;

      // ident
      result = ident_uri(source, cursor);
      if(!result.value){
        error('invalid ident detected');
        return { cursor: head, token: null };
      }
      cursor = result.cursor;
      token.dtd.ident = result.value;

      // "\s" , { "\s" }
      if(!source[cursor] || !/\s/.test(source[cursor] as string)){
        error('whitespace is not exist');
        return { cursor: head, token: null };
      }
      wsRegexp.lastIndex = cursor;
      wsResult = wsRegexp.exec(source);
      if(!wsResult){
        error('whitespace continues to the end');
        return { cursor: head, token: null };
      }
      cursor = wsResult.index;
    } else{
      error('invalid specifier detected');
      return { cursor: head, token: null };
    }

    // uri
    result = ident_uri(source, cursor);
    if(!result.value){
      error('invalid uri detected');
      return { cursor: head, token: null };
    }
    cursor = result.cursor;
    token.dtd.uri = result.value;

    // ]
  }

  // ">"
  if(source[cursor] != '>'){
    error('startTag is not end with ">"');
    return { cursor: head, token: null };
  }
  cursor++;
  
  return { cursor, token };
}

/**
 * ident = ident_uri ;
 * uri = ident_uri ;
 * ident_uri = ( ( ? all-character ? - '\s' - ">" ) , { ( ? all-character ? - '\s' - ">" ) } ) | ( '"" , { ( ? all-character ? - '"' ) } , '"" ) ;
 * @param source source string
 * @param cursor matching index
 */
function ident_uri(source: string, cursor: number): { cursor: number, value: string }{

  const head = cursor;

  let value = ``;

  if(source[cursor] == '"'){
    // ( '"" , { ( ? all-character ? - '"' ) } , '"" )

    const regexp = /"/g;
    regexp.lastIndex = cursor + 1;
    const result = regexp.exec(source);
    if(!result) return { cursor: head, value: '' };
    value = source.substring(cursor + 1, result.index);
    cursor = result.index + 1;
  } else if(source[cursor] && /[^(\s|>)]/.test(source[cursor] as string)){
    // ( ( ? all-character ? - '\s' - ">" ) , { ( ? all-character ? - '\s' - ">" ) } )

    // ( ( ? all-character ? - '\s' - ">" )
    const regexp = /(\s|>)/g;
    regexp.lastIndex = cursor;
    const result = regexp.exec(source);
    if(!result) return { cursor: head, value: '' };
    value = source.substring(cursor, result.index);
    cursor = result.index;
  } else return { cursor: head, value: '' };

  return { cursor, value };
}

/**
 * doctype-root = [a-zA-Z] , { [a-zA-Z0-9] } ;
 * @param source source string
 * @param cursor matching index
 */
function root(source: string, cursor: number): { cursor: number, value: string }{
  
  const head = cursor;

  // [a-zA-Z]
  if(!source[cursor] || !/[a-zA-Z]/.test(source[cursor] as string))
    return { cursor: head, value: '' };
  
  // { [a-zA-Z0-9] }
  const regexp = /[a-zA-Z0-9]+/g;
  regexp.lastIndex = cursor;
  const result = regexp.exec(source);
  if(!result || result.index != cursor)
    return { cursor: head, value: '' };
  const value = (result[0] as string).toLowerCase();
  cursor += value.length;

  return { cursor, value };
}

export default doctypeDefine;
