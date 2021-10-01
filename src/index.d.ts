import { Parser } from "arcsecond";

export const u8: Parser<number>;
export const s8: Parser<number>;
export const u16LE: Parser<number>;
export const s16LE: Parser<number>;
export const u16BE: Parser<number>;
export const s16BE: Parser<number>;
export const u32LE: Parser<number>;
export const s32LE: Parser<number>;
export const u32BE: Parser<number>;
export const s32BE: Parser<number>;
export const nullTerminatedString: Parser<string>;

export function exactU8(expected: number): Parser<number>;
export function exactS8(expected: number): Parser<number>;
export function exactU16LE(expected: number): Parser<number>;
export function exactU16BE(expected: number): Parser<number>;
export function exactS16LE(expected: number): Parser<number>;
export function exactS16BE(expected: number): Parser<number>;
export function exactU32LE(expected: number): Parser<number>;
export function exactU32BE(expected: number): Parser<number>;
export function exactS32LE(expected: number): Parser<number>;
export function exactS32BE(expected: number): Parser<number>;
