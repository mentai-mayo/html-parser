
/**
 * tagname = [a-zA-Z] , { ( ? all-character ? - "/" - "<" - ">" - "\s" ) } ;
 * @param source source string
 * @param cursor matching index
 */
function tagName(source: string, cursor: number): { cursor: number, value: string }{
  const regexp = /[a-zA-Z][^(\/|\s|<|>)]*/g;
  regexp.lastIndex = cursor;
  const result = regexp.exec(source);
  if(!result || result.index != cursor)
    return { cursor, value: '' };
  const value = result[0] as string;
  return { cursor: cursor + value.length, value };
}

export default tagName;
