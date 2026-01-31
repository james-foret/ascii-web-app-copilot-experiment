# License Selection Guide

This file provides information to help you select an appropriate license for this repository.

## Quick License Selector

### I want it simple and permissive
**MIT License** - Short, simple, and permissive. Allows commercial use with minimal restrictions.

### I want to protect my code from patent claims
**Apache License 2.0** - Permissive like MIT, but includes explicit patent grant protection.

### I want derivatives to remain open source
**GNU GPL v3.0** - Requires that derivative works also be open source (copyleft).

### I want a lighter copyleft
**GNU LGPL v3.0** - Like GPL but allows linking from proprietary software.

### I want maximum freedom
**The Unlicense** - Releases code into the public domain with no restrictions.

---

## Popular Open Source Licenses

### MIT License
**Best for:** Simple projects, maximum adoption, commercial-friendly

```
MIT License

Copyright (c) [year] [fullname]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

### Apache License 2.0
**Best for:** Projects that need patent protection, enterprise adoption

```
Apache License
Version 2.0, January 2004
http://www.apache.org/licenses/

Copyright [yyyy] [name of copyright owner]

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```

### GNU General Public License v3.0 (GPL-3.0)
**Best for:** Ensuring derivatives remain open source

```
Copyright (C) [year] [name of author]

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
```

### BSD 3-Clause License
**Best for:** Similar to MIT but with explicit non-endorsement clause

```
Copyright (c) [year], [fullname]
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this
   list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice,
   this list of conditions and the following disclaimer in the documentation
   and/or other materials provided with the distribution.

3. Neither the name of the copyright holder nor the names of its
   contributors may be used to endorse or promote products derived from
   this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
```

### The Unlicense
**Best for:** Dedicating work to the public domain

```
This is free and unencumbered software released into the public domain.

Anyone is free to copy, modify, publish, use, compile, sell, or
distribute this software, either in source code form or as a compiled
binary, for any purpose, commercial or non-commercial, and by any
means.

In jurisdictions that recognize copyright laws, the author or authors
of this software dedicate any and all copyright interest in the
software to the public domain. We make this dedication for the benefit
of the public at large and to the detriment of our heirs and
successors. We intend this dedication to be an overt act of
relinquishment in perpetuity of all present and future rights to this
software under copyright law.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR
OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

For more information, please refer to <https://unlicense.org/>
```

---

## How to Choose

### Consider these questions:

1. **Do you want others to use your code commercially?**
   - Yes → MIT, Apache 2.0, BSD
   - No → GPL

2. **Do you care if derivatives are also open source?**
   - Yes → GPL, LGPL
   - No → MIT, Apache 2.0, BSD

3. **Do you need patent protection?**
   - Yes → Apache 2.0, GPL v3
   - No → MIT, BSD

4. **Do you want the simplest possible license?**
   - Yes → MIT or Unlicense
   - No → Apache 2.0 or BSD

### Recommendations by Project Type

- **Web apps/libraries:** MIT or Apache 2.0
- **Developer tools:** MIT or Apache 2.0
- **Enterprise software:** Apache 2.0
- **Community projects:** GPL v3.0
- **Educational/experimental:** MIT or Unlicense

---

## How to Apply a License

1. Replace this entire file with your chosen license text
2. Update `[year]` with the current year
3. Update `[fullname]` or `[name of copyright owner]` with your name
4. Optionally add a license badge to your README.md
5. If using GitHub, ensure the repository's license setting matches

## More Information

- [Choose a License](https://choosealicense.com/) - GitHub's license selection tool
- [Open Source Initiative](https://opensource.org/licenses) - Full license texts
- [TLDRLegal](https://tldrlegal.com/) - Plain English license explanations

---

## Note

This is a temporary guide file. Once you select a license, replace this entire file with the actual license text.
