export interface BareModules {
  defaultGroup: string
  groups: Record<string, string | RegExp | Array<string | RegExp>>
}

export interface PluginOptions {
  snippetFile: string
  themeRoot: string
  bareModules: boolean | BareModules
}
