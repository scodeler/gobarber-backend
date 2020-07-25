import IParseMailTemplateDTO from '@shared/container/providers/MailTemplateProvider/dtos/IParseMailTempalteDTO';

export default interface IMailTemplateProvider {
  parse(data: IParseMailTemplateDTO): Promise<string>;
}
