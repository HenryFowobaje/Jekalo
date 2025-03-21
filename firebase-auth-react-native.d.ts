declare module "firebase/auth/react-native" {
    import { Persistence } from "firebase/auth";
  
    /**
     * Returns a Persistence instance that uses the provided storage mechanism.
     * @param storage The storage instance (e.g. AsyncStorage).
     */
    export function getReactNativePersistence(storage: any): Persistence;
  
    export * from "firebase/auth";
  }
  