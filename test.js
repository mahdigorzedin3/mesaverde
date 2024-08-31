"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var session = require("express-session");
var cookieParser = require("cookie-parser");
var path = require("path");
var url = require("url");
var jwt = require("jsonwebtoken");
var bodyParser = require("body-parser");
var dotenv = require("dotenv");
var cors = require("cors");
var client_1 = require("./meti-prisma/node_modules/@prisma/client");
var app = express();
var prisma = new client_1.PrismaClient();
app.use(cookieParser());
dotenv.config();
app.use(cors());
app.use(session({
    secret: 'dksj933iueddowd',
    resave: true,
    saveUninitialized: true,
    name: 'yourin'
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static(path.resolve(__dirname, 'public')));
app.get('/', function (req, res) {
    res.sendFile(path.resolve(__dirname, 'public', 'shop.html'));
});
var secret = 'thisshouldbeasecret';
var user = {};
app.post("/login", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, user, token;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, email = _a.email, password = _a.password;
                return [4 /*yield*/, prisma.customersinfo.findUnique({
                        where: {
                            email: email,
                            password: password
                        },
                    })];
            case 1:
                user = _b.sent();
                if (user === null || user === void 0 ? void 0 : user.fullname) {
                    token = jwt.sign({ userId: user.number }, secret, {
                        expiresIn: '1h',
                    });
                    req.session.errauth = false;
                    req.session.save();
                    res.cookie('jwt', token, { httpOnly: true, secure: true, maxAge: 3600000 });
                    res.cookie('name', user.fullname, { httpOnly: false, secure: true, maxAge: 3600000 });
                    res.redirect('/');
                }
                else {
                    req.session.errauth = true;
                    req.session.save();
                    res.redirect('/signin/');
                }
                return [2 /*return*/];
        }
    });
}); });
app.get('/signip/nonauth', function (req, res) {
    if (req.session.errauth) {
        req.session.errauth = false;
        req.session.save();
        res.json('ایمیل یا رمز ورود شما اشتباه است !');
    }
});
app.get('/signup/', function (req, res) {
    res.status(200).sendFile(path.resolve(__dirname, 'public', 'signup', 'signup.html'));
});
app.get('/signin/', function (req, res) {
    res.status(200).sendFile(path.resolve(__dirname, 'public', 'signin', 'signin.html'));
});
app.post('/create', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, fullname, email, number, password, registe, putuser, token;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, fullname = _a.fullname, email = _a.email, number = _a.number, password = _a.password;
                console.log(email);
                return [4 /*yield*/, prisma.customersinfo.findFirst({
                        where: {
                            email: email
                        }
                    })];
            case 1:
                registe = _b.sent();
                if (!(registe === null || registe === void 0 ? void 0 : registe.fullname)) return [3 /*break*/, 2];
                req.session.doublemail = true;
                req.session.save();
                res.redirect('/signup/');
                return [3 /*break*/, 4];
            case 2:
                req.session.doublemail = false;
                req.session.save();
                return [4 /*yield*/, prisma.customersinfo.create({
                        data: {
                            fullname: fullname,
                            email: email,
                            number: number,
                            password: password
                        }
                    })];
            case 3:
                putuser = _b.sent();
                token = jwt.sign({ userId: number }, secret, {
                    expiresIn: '1h',
                });
                res.cookie('jwt', token, { httpOnly: true, secure: true, maxAge: 3600000 });
                res.cookie('name', fullname, { httpOnly: false, secure: true, maxAge: 3600000 });
                res.redirect('/');
                _b.label = 4;
            case 4: return [2 /*return*/];
        }
    });
}); });
app.get('/create/error', function (req, res) {
    if (req.session.doublemail) {
        req.session.doublemail = false;
        req.session.save();
        res.json('اکانت دیگری با این ایمیل ساخته شده است!');
    }
});
app.get('/products/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var q, product;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                q = url.parse(req.url, true).query;
                if (!(q === null || q === void 0 ? void 0 : q.id)) return [3 /*break*/, 2];
                return [4 /*yield*/, prisma.products.findUnique({
                        where: {
                            id: +q.id
                        }
                    })];
            case 1:
                product = _a.sent();
                if (product === null || product === void 0 ? void 0 : product.brand) {
                    req.session.pro = product;
                    req.session.save();
                    res.sendFile(path.resolve(__dirname, 'public', 'products/pro.html'));
                }
                else {
                    res.redirect('/');
                }
                return [3 /*break*/, 3];
            case 2:
                res.redirect('/');
                _a.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); });
app.get('/gson', function (req, res) {
    res.json(req.session.pro);
});
app.post('/cart', function (req, res) {
    var q = url.parse(req.url, true).query;
    if (q === null || q === void 0 ? void 0 : q.id) {
        req.session.cart = req.session.cart || [];
        if (!req.session.cart.includes(+q.id))
            req.session.cart.push(+q.id);
        req.session.save();
    }
});
app.post('/cartshop', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var cartproduct;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (!((_a = req.session) === null || _a === void 0 ? void 0 : _a.cart)) return [3 /*break*/, 2];
                return [4 /*yield*/, prisma.products.findMany({
                        where: {
                            id: { in: req.session.cart }
                        }
                    })];
            case 1:
                cartproduct = _b.sent();
                res.json(cartproduct);
                return [3 /*break*/, 3];
            case 2:
                res.json(undefined);
                _b.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); });
app.post('/cart/remove', function (req, res) {
    var _a;
    var q = url.parse(req.url, true).query;
    if ((q === null || q === void 0 ? void 0 : q.id) && ((_a = req.session) === null || _a === void 0 ? void 0 : _a.cart)) {
        var index = req.session.cart.indexOf(+q.id);
        req.session.cart.splice(index, 1);
        req.session.save();
    }
});
app.get('/shopcart', function (req, res) {
    res.sendFile(path.resolve(__dirname, 'public', 'cart.html'));
});
app.listen(5000);
