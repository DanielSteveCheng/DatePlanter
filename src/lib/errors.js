const IPC_PREFIX = /^Error invoking remote method '[^']+': (?:\w*Error: )?/;

export const readableError = (error) => String(error?.message ?? error).replace(IPC_PREFIX, '');
