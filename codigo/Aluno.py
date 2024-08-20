class Aluno:
    def __init__(self, nome,matricula):#construtor
        self.nome = nome
        self.matricula = matricula

    def aprovado(self):
        print(f'O aluno {self.nome} de matricula {self.matricula} está aprovado')

alun1 = Aluno("fernando", 132123)
# alun1.aprovado()

# print(alun1.__dict__) #Retorna o objeto em formato json e é editavel

print(vars(alun1))#Retorna o objeto em formato json mas não é editavel