class Aluno:
    def __init__(self, nome,matricula,senha):#construtor
        self.nome = nome
        self.matricula = matricula
        self.senha = senha

    def acessarPerfil(self):
        print(f'O aluno {self.nome} de matricula {self.matricula} está aprovado')

    def matricularDisciplina(self):
        print(f'Aluno {self.nome} está matriculado')

    def pagarDivida(self):
        print(f'Divida paga')


# alun1.aprovado()
# print(alun1.__dict__) #Retorna o objeto em formato json e é editavel
#Retorna o objeto em formato json mas não é editavel