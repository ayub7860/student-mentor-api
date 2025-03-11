/* Copyright (c) 2024 Soft The Next, All Rights Reserved. */

const{createLogger:createLogger,format:format}=require("winston"),{combine:combine,timestamp:timestamp,label:label,printf:printf}=format,myFormat=printf((({level:e,message:t,label:r,timestamp:o})=>`${o} [${r}] ${e}: ${t}`)),winston=require("winston");require("winston-daily-rotate-file");const transport=new winston.transports.DailyRotateFile({filename:"./log/log-%DATE%.log",datePattern:"YYYY-MM-DD-HH",zippedArchive:!0,maxSize:"20m",maxFiles:"14d"}),wlogger=createLogger({format:combine(label({label:"winston log"}),timestamp(),myFormat),transports:[transport]});module.exports=wlogger;