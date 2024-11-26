# 错误处理 {#error}

## 基本介绍 {#error-introduction}

标准库的error相对比较简单，无法对错误的状态信息进行传递。为此，框架层专门设计了一套错误处理机制，通过errors.NewError()和codes.Convert()可以实现错误在集群服务间随意转换。

## 错误接口 {#error-define}

为了避免标准库errors与框架库errors上的名字冲突，方便开发者使用。框架库errors也重载了标准库errors的所有函数。因此，无论你是想创建普通的error还是框架设计的error，你都可以使用框架库的errors。

框架错误库重载函数

```bash
github.com/dobyte/due/v2/errors
```

```go
// New Wrapping for errors.New standard library
func New(text string) error

// Is Wrapping for errors.Is standard library
func Is(err, target error) bool

// As Wrapping for errors.As standard library
func As(err error, target any) bool

// Unwrap Wrapping for errors.Unwrap standard library
func Unwrap(err error) error
```

框架错误库扩展函数

```bash
github.com/dobyte/due/v2/errors
```

```go
// NewError 新建一个错误
// 可传入一下参数：
// text : 文本字符串
// code : 错误码
// error: 原生错误
func NewError(args ...interface{}) *Error

// NewErrorWithStack 新建一个带堆栈的错误
// 可传入一下参数：
// text : 文本字符串
// code : 错误码
// error: 原生错误
func NewErrorWithStack(args ...interface{}) *Error

// Code 返回错误码
func Code(err error) *codes.Code

// Next 返回下一个错误
func Next(err error) error

// Cause 返回根因错误
func Cause(err error) error

// Stack 返回堆栈
func Stack(err error) *stack.Stack

// Replace 替换文本
func Replace(err error, text string, condition ...codes.Code) error
```

框架错误码库函数

```bash
github.com/dobyte/due/v2/codes
```

```go
// NewCode 新建一个错误码
func NewCode(code int, message ...string) *Code

// Convert 将错误信息转换为错误码
func Convert(err error) *Code
```

## 示例代码 {#errors-example}

创建一个附带错误码的错误

```go
err := errors.NewError(codes.NewCode(404, "not found"))
```

将一个错误转换为错误码

```go
code := codes.Convert(err)
```

完整示例

```go
package main

import (
	"fmt"
	"github.com/dobyte/due/v2/codes"
	"github.com/dobyte/due/v2/errors"
)

func main() {
	err := errors.NewError(codes.NewCode(404, "not found"))

	code := codes.Convert(err)

	fmt.Println(err)
	fmt.Println(code.Code())
	fmt.Println(code.Message())
}
```

运行示例

```bash
$ go run main.go
code error: code = 404 desc = not found
404
not found
```