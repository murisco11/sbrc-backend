import win32print
import win32api
import os

def imprimir(nome_arquivo):
    printer_name = "Argox OS-214 plus series PPLA" # Printer name here

    file_path = os.path.join("files", nome_arquivo)

    if not os.path.exists(file_path):
        print(f"File '{file_path}' not found on 'files'.")
        exit(1)

    with open(file_path, "rb") as file:
        raw_data = file.read()

    win32print.SetDefaultPrinter(printer_name)
    hPrinter = win32print.OpenPrinter(printer_name)
    printer_info = win32print.GetPrinter(hPrinter, 2)
    hJob = win32print.StartDocPrinter(hPrinter, 1, ("Etiqueta", None, "RAW"))
    win32print.StartPagePrinter(hPrinter)
    win32print.WritePrinter(hPrinter, raw_data)
    win32print.EndPagePrinter(hPrinter)
    win32print.EndDocPrinter(hPrinter)
    win32print.ClosePrinter(hPrinter)