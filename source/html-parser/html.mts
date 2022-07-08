
import endTag from "./endTag.mjs";
import startTag from "./startTag.mjs";
import innerText from "./innerText.mjs";
import doctypeDefine from "./doctypeDefine.mjs";

export type HTMLToken = {
  type: 'start' | 'end' | 'text' | 'doctype';
  dtd?: { root: string } | { root: string, specifier: 'system', uri: string } | { root: string, specifier: 'public', ident: string, uri: string };
  value?: string;
  tagName?: string;
  attributes?: { [key: string]: string };
};

export function parse(source: string): HTMLToken[]{
  
  const tokenList: HTMLToken[] = [];

  let result: { token: HTMLToken | null, cursor: number } = {token: null, cursor: 0};

  // dtd
  result = doctypeDefine(source, result.cursor);
  if(result.token) tokenList.push(result.token);

  while(result.cursor < source.length){

    // init
    result.token = null;

    // tokenize
    if(!result.token) result = endTag(source, result.cursor);
    if(!result.token) result = startTag(source, result.cursor);
    if(!result.token) result = innerText(source, result.cursor);

    // detect cannot continue tokenize
    if(!result.token)
      throw new Error('[html-parser] cannot continue tokenize');
    
    // add token
    tokenList.push(result.token);
  }

  return tokenList;
}
