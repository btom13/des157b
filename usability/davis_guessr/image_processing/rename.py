from random import choice
import os


def randomize_files(dir):
    files = len(os.listdir(dir))
    numbers = set(range(1, files + 1))
    for f in os.listdir(dir):
        if f.startswith("."):
            continue
        path = os.path.join(dir, f)
        if os.path.isfile(path):
            c = choice(list(numbers))
            numbers.remove(c)
            newpath = os.path.join(dir, "img_{}.jpeg".format(c))
            # os.rename(path, newpath)
            print("rename {} to {}".format(path, newpath))


randomize_files("images")