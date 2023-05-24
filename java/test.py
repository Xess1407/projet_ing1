def greet(name):
    print("Hello, " + name + "!")

def calculate_sum(a, b):
    return a + b

def factorial(n):
    if n == 0:
        return 1
    else:
        return n * factorial(n-1)

def fibonacci(n):
    if n <= 1:
        return n
    else:
        return fibonacci(n-1) + fibonacci(n-2)

def is_prime(n):
    if n <= 1:
        return False
    for i in range(2, int(n**0.5) + 1):
        if n % i == 0:
            return False
    return True

def print_table(n):
    for i in range(1, n+1):
        for j in range(1, n+1):
            print(i * j, end="\t")
        print()

greet("Alice")
result = calculate_sum(3, 4)
print("The result is:", result)

fact = factorial(5)
print("Factorial of 5 is:", fact)

fib = fibonacci(10)
print("Fibonacci sequence up to 10th term:", end=" ")
for i in range(fib):
    print(fibonacci(i), end=" ")
print()

num = 17
if is_prime(num):
    print(num, "is a prime number.")
else:
    print(num, "is not a prime number.")

print("Multiplication table up to 5:")
print_table(5)