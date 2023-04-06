import { GrepToolInterface } from './GrepToolInterface'

// @ts-ignore
import grob from 'grob'

export async function grepToolImpl(params: GrepToolInterface) {
  const { globs, regex } = params
  const res = await grob({ cwd: process.cwd(), globs, regex })
  return res
}
