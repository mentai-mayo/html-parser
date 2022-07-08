
import { HTMLToken } from './html.mjs';

/**
 * innerText = ( ? all-character ? - '<' ) , { ? all-character ? - '<' } ;
 * @param source source string
 * @param cursor matching index
 */
function innerText(source: string, cursor: number): { cursor: number, token: HTMLToken | null }{
  
  const head = cursor;

  const token = { type: 'text' as 'text', value: '' };

  // ( ? all-character ? - '<' )
  if(source[cursor] == '<'){
    console.error('[innerText]', 'innerText cannot start with "<"');
    return { cursor, token: null };
  }

  // ( ? all-character ? - '<' ) , { ? all-character ? - '<' } => /[^<]+/
  const regexp = /</g;
  regexp.lastIndex = cursor;
  const result = regexp.exec(source);
  if(!result) cursor = source.length;
  else cursor = result.index;
  token.value = source.substring(head, cursor);

  return { cursor, token };
}

export default innerText;
