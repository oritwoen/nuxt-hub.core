// async function streamToArrayBuffer(stream: ReadableStream, streamSize: number) {
//   const result = new Uint8Array(streamSize)
//   let bytesRead = 0
//   const reader = stream.getReader()
//   while (true) {
//     const { done, value } = await reader.read()
//     if (done) {
//       break
//     }
//     result.set(value, bytesRead)
//     bytesRead += value.length
//   }
//   return result
// }

export default eventHandler(async (event) => {
  const { pathname } = await getValidatedRouterParams(event, z.object({
    pathname: z.string().min(1)
  }).parse)
  const query = getQuery(event)

  const contentType = getHeader(event, 'content-type')
  const contentLength = Number(getHeader(event, 'content-length') || '0')
  if (!query.contentType) {
    query.contentType = contentType
  }
  if (!query.contentLength) {
    query.contentLength = contentLength
  }

  // FIXME: find a way to re-stream the readable stream
  const body = getRequestWebStream(event)!
  // const stream = getRequestWebStream(event)!
  // const body = await streamToArrayBuffer(stream, contentLength)

  return useBlob().put(pathname, body, query)
})