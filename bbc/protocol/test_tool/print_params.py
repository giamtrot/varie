
import sys

def main():
    print("Received parameters:")
    for i, arg in enumerate(sys.argv):
        print(f"Argument {i}: {arg}")
    
    input("Press Enter to exit...")


if __name__ == "__main__":
    main()
