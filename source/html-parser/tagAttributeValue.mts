/**
 * tagAttributeValue = ( { ( ? all-character ? - "\s" ) } ) | ( '"' , { ( ? all-character ? - '"' ) } , '"' ) ;
 * @param source source string
 * @param cursor matching index
 */
function tagAttrValue(source: string, cursor: number): { cursor: number, value: string }{
  const regexp = /("[^"]+")|([^\s]+)/g;
  regexp.lastIndex = cursor;
  const result = regexp.exec(source);
  if(!result || result.index != cursor)
    return { cursor, value: '' };
  let value = result[0] as string;
  cursor += value.length;
  if(value[0] == '"')
    value = value.substring(1, value.length - 1);
  return { cursor , value };
}

export default tagAttrValue;
