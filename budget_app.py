#In this lab, you will build a simple budget app that tracks spending in different categories and can show the relative spending percentage on a graph.

class Category:
    def __init__(self,ledger):
        self.ledger=[]
    def deposit(self,amount,description):
        self.ledger.append({'amount': amount, 'description': description})

    def withdraw(self,amount,description=[]):
        if self.check_funds(amount):
            self.ledger.append({'amount': -amount, 'description': description})
            return True
        else:
            return False

    def get_balance(self):
        return sum(item['amount'] for item in self.ledger)

    def check_funds(self, amount):
        return self.get_balance() >= amount

    def transfer(self, amount, category):
        if self.check_funds(amount):
            self.withdraw(amount, f'Transfer to {category.__str__()}')
            category.deposit(amount, f'Transfer from {self.__str__()}')
            return True
        else:
            return False
        
    
def create_spend_chart(categories):
    total_spent = sum(-item['amount'] for category in categories for item in category.ledger if item['amount'] < 0)
    category_spent = [sum(-item['amount'] for item in category.ledger if item['amount'] < 0) for category in categories]
    percentages = [int((spent / total_spent) * 10) * 10 for spent in category_spent]

    chart = "Percentage spent by category\n"
    for i in range(100, -1, -10):
        chart += f"{i:>3}| " + " ".join("o" if p >= i else " " for p in percentages) + " \n"
    chart += "    " + "-" * (len(categories) * 3 + 1) + "\n"

    max_length = max(len(category.__str__()) for category in categories)
    for i in range(max_length):
        chart += "     "
        for category in categories:
            name = category.__str__()
            chart += f"{name[i] if i < len(name) else ' '}  "
        chart += "\n"

    return chart