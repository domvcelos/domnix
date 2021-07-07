import { CpfCnpjPipe } from './cpf-cnpj.pipe';

describe('cpfCnpjPipe', () => {
  it('create an instance', () => {
    const pipe = new CpfCnpjPipe();
    expect(pipe).toBeTruthy();
  });
});
