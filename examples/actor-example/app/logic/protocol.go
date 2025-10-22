package logic

// 请求
type loginReq struct {
	Account  string `json:"account"`
	Password string `json:"password"`
}

// 响应
type loginRes struct {
	Code int `json:"code"`
}

// 请求
type createReq struct {
	Name string `json:"name"`
}

// 响应
type createRes struct {
	Code int            `json:"code"`
	Data *createResData `json:"data"`
}

// 响应数据
type createResData struct {
	RoomID int64 `json:"roomID"`
}

// 请求
type joinReq struct {
	RoomID int64 `json:"roomID"`
}

// 响应
type joinRes struct {
	Code int `json:"code"`
}

// 请求
type playReq struct {
	Action string `json:"action"`
}

// 响应
type playRes struct {
	Code int `json:"code"`
}
