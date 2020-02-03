package Exceptions;

import java.io.IOException;

class A {
	void m1() throws Exception {
		System.out.println("In m1 A");
	}
}

class B extends A {
	void m1() throws IOException {
		System.out.println("In m1 B");
	}
}

public class IOExceptin {

}
