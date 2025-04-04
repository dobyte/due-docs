# 快速开始 {#quick-start}

## Go编译器安装

1. 安装Go多版本管理器（推荐）

    - Linux/macOS下自动安装Go多版本管理器（适用于 bash、zsh）

    ```shell
    $ curl -sSL https://raw.githubusercontent.com/voidint/g/master/install.sh | bash
    $ cat << 'EOF' >> ~/.bashrc
    # 可选。检查g别名是否被占用
    if [[ -n $(alias g 2>/dev/null) ]]; then
        unalias g
    fi
    EOF 
    $ source "$HOME/.g/env"
    ```

    - Windows下自动安装Go多版本管理器（适用于 pwsh）

    ```shell
    $ iwr https://raw.githubusercontent.com/voidint/g/master/install.ps1 -useb | iex
    ```

2. 安装Go编译器

    ```shell
    $ g install 1.22.9
    ```

## 工具链安装

1. 安装protobuf编译器（使用场景：开发mesh微服务、使用protobuf作为与客户端通信的协议）

    - Linux, using apt or apt-get, for example:

    ```shell
    $ apt install -y protobuf-compiler
    $ protoc --version  # Ensure compiler version is 3+
    ```

    - MacOS, using Homebrew:

    ```shell
    $ brew install protobuf
    $ protoc --version  # Ensure compiler version is 3+
    ```

    - Windows, download from [Github](https://github.com/protocolbuffers/protobuf/releases):

2. 安装protobuf go代码生成工具（使用场景：开发mesh微服务、使用protobuf作为与客户端通信的协议）

    ```shell
    go install google.golang.org/protobuf/cmd/protoc-gen-go@latest
    ```

3. 安装grpc代码生成工具（使用场景：使用[GRPC](https://grpc.io/)组件开发mesh微服务）

    ```shell
    go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest
    ```

4. 安装rpcx代码生成工具（使用场景：使用[RPCX](https://rpcx.io/)组件开发mesh微服务）

    ```shell
    go install github.com/rpcxio/protoc-gen-rpcx@latest
    ```

5. 安装gorm dao代码生成工具（使用场景：使用[GORM](https://gorm.io/)作为数据库orm）

    ```shell
    go install github.com/dobyte/gorm-dao-generator@latest
    ```

6. 安装mongo dao代码生成工具（使用场景：使用[MongoDB](https://github.com/mongodb/mongo-go-driver)作为数据库orm）

    ```shell
    go install github.com/dobyte/mongo-dao-generator@latest
    ```

## 编写网关服务器

## 编写节点服务器

## 编写测试客户端