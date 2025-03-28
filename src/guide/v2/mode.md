# 运行模式 {#mode}

## 基础介绍 {#mode-introduction}

运行模式在现有绝大多数成熟框架中都会有设计，主要作用是为了通过程序外部参数来改变程序内部预先定义好的行为。在[due](https://github.com/dobyte/due)框架中也设计了debug、test、release三种运行模式。开发者可以根据自身需要来进行合理使用。

## 设置模式 {#mode-set-mode}

你可以通过以下方式来设置运行模式：
1. 通过配置文件指定 etc.mode=debug
2. 通过环境变量指定 DUE_MODE=debug
3. 通过启动参数指定 --mode=debug
4. 通过调用mode.SetMode()函数指定

设置优先级：配置文件 < 环境变量 < 运行参数 < mode.SetMode()


## 获取模式 {#mode-get-mode}

你可以通过以下方式来获取当前程序的运行模式：

```bash
github.com/dobyte/due/v2/mode
```

```go
// GetMode 获取运行模式
func GetMode() string

// IsDebugMode 是否Debug模式
func IsDebugMode() bool

// IsTestMode 是否Test模式
func IsTestMode() bool

// IsReleaseMode 是否Release模式
func IsReleaseMode() bool
```