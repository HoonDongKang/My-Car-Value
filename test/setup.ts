import { rm } from 'fs/promises';
import { join } from 'path';

//test마다 test.sqlite db 삭제하고 저장
global.beforeEach(async () => {
  try {
    await rm(join(__dirname, '..', 'test.sqlite'));
  } catch (err) {}
});
