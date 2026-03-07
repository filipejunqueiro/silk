import { PrintType } from "@/types";

export class Print {
  private static _getPrintPrefix(printType: PrintType): string {
    switch (printType) {
      case "info":
        return "^4[INFO]^0";
      case "success":
        return "^2[SUCCESS]^0";
      case "warning":
        return "^3[WARNING]^0";
      default:
        return "^4[INFO]^0";
    }
  }

  public static write(message: string, printType: PrintType = "info"): void {
    console.log(`${this._getPrintPrefix(printType)}: ${message}`);
  }
}
