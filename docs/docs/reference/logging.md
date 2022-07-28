---
sidebar_label: Logging
sidebar_position: 5
---

# Logging

## Supported log levels {#logLevels}
Nango supports the following log levels (these are directly taken from [Winston](https://github.com/winstonjs/winston#logging-levels), the logging library used internally by Nango).

This list is sorted in descending order of importance, specifying a log level will also permit all levels above of it.

| level | description |
|---|---|
| error | Error messages: Something is broken or wrong, the operation could not be completed |
|  warn | Warnings: Something may break in the future or on a certain edge case but the operation could be completed |
| info | Information about the main operations happening |
| http | Detailed http request & response information is logged (currently not in use by Nango, may be removed in the near future -> use debug instead) |
| verbose | More detailed information, such as non-main operations, are logged (currently not in use by Nango, may be removed in the near future -> use debug instead) |
| debug | Detailed information that can be useful for debugging gets logged. Logs may get very large due to long output |
| silly | Don't be ridiculous |