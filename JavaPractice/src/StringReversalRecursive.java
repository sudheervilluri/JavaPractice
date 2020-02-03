
public class StringReversalRecursive {
	String revStr="";
public static void main(String[] args) {
	StringReversalRecursive srr = new StringReversalRecursive();
    System.out.println("Result: "+srr.reversiveString("Jasadadas das"));
}

public String reversiveString(String str) {
	if(str.length() == 0) {
		return revStr;
	}else {
		revStr+=str.charAt(str.length()-1)+reversiveString(str.substring(0, str.length()-1));
		return revStr;
	}
}

}
