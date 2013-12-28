declare class Promise {
    static cast(obj: any): Promise;
    static resolve(obj: any): Promise;
    static reject(obj: any): Promise;
    static all(array: any[]): any;
    static race(array: any[]): any;

    constructor(func: (resolve: Function, relect: Function) => void);

    then(onFulfilled: Function, onRejected?: Function);
    catch(onRejected: Function);
}