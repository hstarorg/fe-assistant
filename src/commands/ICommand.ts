export interface ICommand {
  execute(args: any): Promise<any>;
}

export interface CommandCtor {
  new (): ICommand;
}
