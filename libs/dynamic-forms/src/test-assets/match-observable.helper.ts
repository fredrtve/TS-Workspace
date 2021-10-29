import { Observable, Subscription } from "rxjs";

export function matchObservable<T>(
    obs$: Observable<T>,
    values: Array<T>,
    expectComplete: boolean = true,
    expectError: boolean = false,
    matcher: (actual: T, expected: T) => boolean = (a, b) => a === b,
    valuePrinter:  (v: T) => string = v => JSON.stringify(v),
): Promise<void>
{
    return new Promise<void>(matchObs);

    function matchObs(resolve: () => void, reject: (reason: string) => void)
    {
        let expectedStep = 0;
        const subs: Subscription = obs$.subscribe({ next, error, complete });
        return;

        function next(value: any)
        {
            if (expectedStep === -1)
                return;

            if (expectedStep >= values.length)
                finalize('Too many values on observable: ' + valuePrinter(value));
            else
            {
                if (matcher(value, values[expectedStep]) === false)
                    finalize(`Values at index ${expectedStep} are expected to match. Received:\n`
                        + `${valuePrinter(value)}\nExpected:\n${valuePrinter(values[expectedStep])}`);
                else
                {
                    expectedStep++;
                    if (!expectComplete && !expectError && expectedStep === values.length)
                        finalize();
                }
            }
        }

        function error(err: any)
        {
            if (expectedStep === -1)
                return;

            if (expectError && expectedStep === values.length)
                finalize();
            else
                finalize(`Observable errored unexpectedly before emission index ${expectedStep}. Error: ${err.toString()}`);
        }

        function complete()
        {
            if (expectedStep === -1)
                return;

            if (expectedStep === values.length)
                finalize();
            else
                finalize(`Observable completed unexpectedly after ${expectedStep} value emissions. `
                    + (expectedStep < values.length
                        ? 'Missing values from observable.'
                        : 'Too many values on observable.'));
        }

        function finalize(message?: string)
        {
            expectedStep = -1;
            setTimeout(() => subs.unsubscribe(), 0);
            if (message)
                reject(message);
            else
                resolve();
        }
    }
}