
public class Abstractconstructor extends Test{
public static void main(String[] args) {
	Abstractconstructor a = new Abstractconstructor();
	a.sayHello();
	
	String s = "Hello";
	
}

@Override
void sayHello() {
	System.out.println("Hello");
	
}
}

abstract class Test {
	Test(){
		System.out.println("Hello 2");
	}
	
	abstract void sayHello();
}