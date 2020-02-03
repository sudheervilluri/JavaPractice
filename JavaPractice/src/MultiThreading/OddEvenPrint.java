package MultiThreading;

public class OddEvenPrint {
	public static void main(String[] args) {
		oddEven odd = new oddEven(1);
		oddEven even = new oddEven(0);

		Thread tr = new Thread(even);
		Thread tr2 = new Thread(odd);
		tr.start();
		tr2.start();
	}
}

class oddEven implements Runnable {
	public int PRINT_NUMBERS_UPTO = 10;
	static int number = 1;
	int remainder;
	static Object lock = new Object();

	oddEven(int remainder) {
		this.remainder = remainder;
	}

	@Override
	public void run() {
		while (number < PRINT_NUMBERS_UPTO) {
			synchronized (lock) {
				while (number % 2 != remainder) { // wait for numbers other than remainder
					try {
						lock.wait();
					} catch (InterruptedException e) {
						e.printStackTrace();
					}
				}
				System.out.println(Thread.currentThread().getName() + " " + number);
				number++;
				lock.notifyAll();
			}
		}
	}
}