import { roc } from '../src/index';

test('.canary', () => expect(roc()).toBe(false));
