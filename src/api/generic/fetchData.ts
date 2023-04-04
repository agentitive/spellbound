import https from "https"

/**
 * Fetches data from an HTTPS server using the specified `options`.
 *
 * @param {https.RequestOptions} options - The HTTPS request options including
 * protocol, host, port, path, etc.
 *
 * @returns {Promise<string>} A promise that resolves with the fetched data as
 * a string.
 *
 * @throws {Error} If there is an error during the request, the promise will be
 * rejected with the error.
 *
 * @example
 * fetchData({hostname: 'example.com', path: '/data'})
 *   .then(data => console.log(data))
 *   .catch(error => console.error(`Error fetching data: ${error.message}`));
 */
export function fetchData(options: https.RequestOptions): Promise<string> {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      const data: Buffer[] = []
      res.on("data", (chunk: Buffer) => {
        data.push(chunk)
      })
      res.on("end", () => {
        resolve(Buffer.concat(data).toString())
      })
    })

    req.on("error", (error) => {
      reject(error)
    })

    req.end()
  })
}
