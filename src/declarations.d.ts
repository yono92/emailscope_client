declare module 'eml-format' {
    const emlFormat: {
      read: (
        emlContent: string,
        callback: (error: Error | null, data: any) => void
      ) => void;
    };
    export default emlFormat;
  }
  