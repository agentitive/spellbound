export type WebviewProcedures = {
    start(): Promise<void>,
    update(message: string): Promise<void>,
    finish(): Promise<void>,
    result(message: string): Promise<void>,
}