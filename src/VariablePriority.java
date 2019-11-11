
public class VariablePriority {

	static{
		System.out.println("Static Block");

	}
	{
		System.out.println("From instance");
	}
	public VariablePriority() {
		System.out.println("From Constructor");
	}
	public static void main(String[] args) {
		VariablePriority v = new VariablePriority();
	}
}
