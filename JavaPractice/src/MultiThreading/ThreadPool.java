package MultiThreading;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class ThreadPool {
	public static void main(String[] args) {
		ExecutorService es = Executors.newFixedThreadPool(4);
		for (int i = 0; i < 100; i++) {
			es.execute(new SampleThread("Thread number "+i));
		}
	}
}

class SampleThread implements Runnable {

	private String message;

	public SampleThread(String message) {
		// TODO Auto-generated constructor stub
		this.message = message;
	}

	@Override
	public void run() {
		System.out.println(Thread.currentThread().getName() + " (Start) message = " + message);
		processmessage();// call processmessage method that sleeps the thread for 2 seconds
		System.out.println(Thread.currentThread().getName() + " (End)");// prints thread name
	}

	private void processmessage() {
		try {
			Thread.sleep(2000);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
	}

}