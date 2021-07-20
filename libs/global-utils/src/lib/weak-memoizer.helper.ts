type InnerCache = WeakMap<object, unknown> | Map<unknown, unknown>;

var cache = new WeakMap();

export function _weakMemoizer<TFunction extends (...args: unknown[]) => unknown>(fn: TFunction): TFunction{ 
  return <TFunction> function(...args: Parameters<TFunction>): ReturnType<TFunction> {
    var fnCache = cache.get(fn);

    if(fnCache !== undefined){
      const val = _getCachedValue(args, fnCache, fn.length);
        if(val !== undefined) 
            return <ReturnType<TFunction>> val;       
    }

    const fnResult = fn(...args);

    cache.set(fn, _setCacheValue(args, fnCache, fn.length, fnResult))

    return <ReturnType<TFunction>> fnResult;
  }
}

function _isObj(x: unknown){ return typeof x === "object" && x !== null };
  
function _getMap(x: unknown){ return _isObj(x) ? new WeakMap() : new Map() };

function _getCachedValue(args: (unknown|object)[], cache: InnerCache, argLength: number, index: number = 0): unknown {
  const argVal: InnerCache | unknown  = cache.get(<object> args[index]);

  if(argVal === undefined) return;
  if(argLength === (index + 1)) return argVal;

  const res = _getCachedValue(args, <InnerCache> argVal, argLength, ++index)

  if(res !== undefined) return res; 
  return    
}

function _setCacheValue(args: (unknown|object)[], cache: InnerCache, argLength: number, result: unknown, index: number = 0) {
  const arg = <object> args[index];
  const argIsNull = arg === undefined || arg === null;

  if(cache === undefined){
    if(argIsNull) return undefined;
    cache = _getMap(arg);
  }

  if(cache instanceof WeakMap && argIsNull) return cache;

  if(argLength === (index + 1)) 
    return cache.set(arg, result);
 
  cache.set(arg, _setCacheValue(args, <InnerCache> cache.get(arg), argLength, result, ++index));

  return cache;
}