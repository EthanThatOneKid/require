export interface RequireOptions {
  check?: () => boolean;
  module?: boolean;
}

/**
 * require the specified module.
 */
export async function require(
  specifier: string,
  options: RequireOptions = {},
): Promise<boolean> {
  if (options.check && !options.check()) {
    return false;
  }

  const script = document.createElement("script");
  script.src = specifier;

  if (options.module) {
    if (!checkModuleSupport()) {
      return false;
    }

    script.type = "module";
  }

  document.head.appendChild(script);

  return await new Promise((resolve) => {
    script.onload = () => resolve(true);
  });
}

function checkModuleSupport(): boolean {
  if ("supports" in HTMLScriptElement) {
    return HTMLScriptElement.supports("module");
  }

  if ("noModule" in document.createElement("script")) {
    return true;
  }

  throw new Error("Module support is not available in this browser");
}
