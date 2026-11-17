#In this lab, you will build a simple budget app that tracks spending in different categories and can show the relative spending percentage on a graph.

class Category:
    def __init__(self, name):
        self.name = name
        self.ledger = []

    def __str__(self):
        title = self.name.center(30, '*')
        items = ''.join(f"{entry['description'][:23]:<23}{entry['amount']:>7.2f}\n" for entry in self.ledger)
        balance = f"Total: {self.get_balance():.2f}"
        return f"{title}\n{items}{balance}"
    def deposit(self, amount, description=''):
        self.ledger.append({'amount': amount, 'description': description})

    def withdraw(self, amount, description=''):
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
            self.withdraw(amount, f'Transfer to {category.name}')
            category.deposit(amount, f'Transfer from {self.name}')
            return True
        else:
            return False
        
    
def create_spend_chart(categories):
    total_spent = sum(
        -item['amount']
        for category in categories
        for item in category.ledger
        if item['amount'] < 0
    )
    category_spent = [
        sum(-item['amount'] for item in category.ledger if item['amount'] < 0)
        for category in categories
    ]
    percentages = [int(spent / total_spent * 10) * 10 if total_spent else 0 for spent in category_spent]

    lines = ["Percentage spent by category"]
    for i in range(100, -1, -10):
        line = f"{i:>3}| "
        for percentage in percentages:
            line += "o  " if percentage >= i else "   "
        lines.append(line)

    lines.append("    " + "-" * (len(categories) * 3 + 1))

    max_length = max(len(category.name) for category in categories)
    for i in range(max_length):
        line = "     "
        for category in categories:
            line += f"{category.name[i] if i < len(category.name) else ' '}  "
        lines.append(line)

    return "\n".join(lines)