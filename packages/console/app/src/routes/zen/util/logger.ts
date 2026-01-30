import { Resource } from "@codemad/console-resource"

export const logger = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metric: (values: Record<string, any>) => {
    console.log(`_metric:${JSON.stringify(values)}`)
  },
  log: console.log,
  debug: (message: string) => {
    if (Resource.App.stage === "production") return
    console.debug(message)
  },
}
